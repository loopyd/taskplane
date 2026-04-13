# Specification: Segment-Aware Steps for Multi-Repo Tasks

**Status:** Draft v3
**Created:** 2026-04-12
**Updated:** 2026-04-12
**Author:** Supervisor + Operator
**Related issues:** #492, #495, #496

---

## Problem Statement

Multi-segment polyrepo tasks consistently fail or require supervisor intervention
because workers cannot distinguish which steps belong to their current segment.
A worker in the `shared-libs` worktree sees steps for `api-service` and either:

- Attempts cross-repo work it can't do (wrong worktree)
- Logs a blocker and exits
- Gets stuck in a no-progress loop with unchecked boxes for future segments

This happened on every multi-segment task in polyrepo testing (TP-004, TP-005).
The supervisor had to steer workers and send wrap-up signals to recover — defeating
the purpose of autonomous execution.

### Root Cause

The system was designed for single-segment tasks where one worker does all steps.
Multi-segment support was added at the engine level (worktrees, segment frontier,
expansion) but the worker-facing contract (PROMPT.md steps, STATUS.md checkboxes,
progress tracking) was never updated to be segment-aware.

---

## Design Goals

1. **Workers only see checkboxes for their current segment** — no cross-repo confusion
2. **Steps are the primary unit of work; segments describe where work happens**
3. **Segments within a step run in parallel** — repo isolation enables this
4. **Step-boundary merges** — each step's work is merged before the next step starts,
   so later steps can see earlier steps' changes across repos
5. **Dynamic expansions carry step definitions** — the discovering worker defines
   what the next segment should do
6. **The create-taskplane-task skill pre-decomposes** — minimize dynamic expansion
   by predicting cross-repo work upfront
7. **Backward compatible** — single-segment tasks (the majority) work exactly as before

---

## Design

### 1. PROMPT.md Format: Segments Inside Steps

Steps remain the primary organizer — they describe **what** to accomplish.
Segments within steps describe **where** the work happens. This preserves the
existing step-level infrastructure (commits, reviews, hydration) while adding
repo-scoping.

**Single-segment task (unchanged):**

```markdown
## Steps

### Step 0: Preflight
- [ ] Verify project structure

### Step 1: Implement feature
- [ ] Create src/utils.js
- [ ] Add tests

### Step 2: Testing & Verification
- [ ] Run full test suite
```

No segment markers needed. Works exactly as today.

**Multi-segment task:**

```markdown
## Steps

### Step 0: Preflight

#### Segment: shared-libs
- [ ] Verify shared-libs repo and src/ directory

#### Segment: web-client
- [ ] Read brand guidelines spec

### Step 1: Create string utilities and API client

#### Segment: shared-libs
- [ ] Create src/string-utils.js with capitalize, slugify, truncate
- [ ] JSDoc comments on each function

#### Segment: web-client
- [ ] Create src/api/client.js importing from shared-libs
- [ ] Add JSDoc comments

### Step 2: Documentation & Delivery

#### Segment: shared-libs
- [ ] Update STATUS.md
- [ ] Verify cross-repo integration
```

**Key rules:**

- `#### Segment: <repoId>` is a checkbox group marker within a step
- Steps are numbered globally and sequentially (Step 0, 1, 2, ...)
- A repoId appears at most once within a step (all checkboxes for that
  step/repo combination are grouped together)
- Segments within a step are **independent and can run in parallel** — if
  segment B depends on segment A's output, segment B belongs in a later step
- Steps without any `#### Segment:` markers belong to the task's primary repo
  (backward compatible with single-segment tasks)
- The create-taskplane-task skill should always include explicit segment
  markers in multi-repo tasks (never rely on the fallback)
- If a worker encounters an ambiguous or misspelled segment reference, it
  should attempt to infer the correct repoId from the workspace config.
  If inference fails, it should escalate to the supervisor for a decision.

### 2. Execution Model: Step-Boundary Merges

This is fundamentally different from today's wave-merge model. Today, all
tasks in a wave run to completion, then one big wave merge happens. In the
new model, **each step is a merge point** — many small merges replace few
large ones.

#### 2.1 Step Execution Flow

For a multi-segment step within a single task:

```
Step 1 starts
├── Provision worktrees for each segment's repo (from latest orch branch HEAD)
├── Spawn parallel workers (one per segment, up to maxSegmentConcurrency)
│   ├── shared-libs worker: executes shared-libs checkboxes
│   ├── web-client worker: executes web-client checkboxes
│   └── (queued segments wait for a slot if over concurrency limit)
├── All segment workers complete
├── Step-boundary merge: merge segment branches into orch branch
│   └── Per-repo serialized (see §2.3)
│   └── Run verification (tests) after merge
└── Step 1 complete → advance to Step 2

Step 2 starts
├── Provision worktrees (now based on merged orch branch HEAD)
│   └── web-client worktree can see shared-libs changes from Step 1
├── Spawn workers for Step 2 segments
└── ...
```

**Why step-boundary merges are necessary:** Without them, Step 2's web-client
segment cannot see Step 1's shared-libs changes — they'd still be on a lane
branch, not the orch branch.

#### 2.2 Multi-Task Waves

In a wave with multiple tasks, each task independently progresses through its
steps and merges at its own pace:

```
Wave 1: Task A (3 steps) and Task B (2 steps) running in parallel

  Task A Step 0: [shared-libs, web-client segments] → step merge
  Task B Step 0: [api-service segment] → step merge
  Task A Step 1: [api-service segment] → step merge (waits if api-service busy)
  Task B Step 1: [shared-libs segment] → step merge
  Task A Step 2: [shared-libs segment] → step merge
  Task A done (.DONE created)
  Task B done (.DONE created)

Wave 1 complete → safety sweep (see §2.4)
Wave 2: ...
```

Tasks don't wait for each other's step boundaries. Task A can merge Step 0
while Task B is still executing Step 0. This maximizes throughput.

**For single-segment tasks**, the step-boundary merge is equivalent to
today's lane merge — one merge at task completion. No change in behavior.

#### 2.3 Per-Repo Merge Serialization

Step-boundary merges target the orch branch. When two tasks merge into the
same repo simultaneously, the second `update-ref` could overwrite the first.

**Solution: per-repo merge queue in the engine.**

```
Engine maintains: activeMerges = Map<repoId, Promise>

When a step completes and needs to merge into repo X:
  1. Check activeMerges.get(repoX)
  2. If busy → queue behind it (await the promise)
  3. Set activeMerges.set(repoX, mergePromise)
  4. Spawn merge agent for repo X
  5. On completion → activeMerges.delete(repoX)
```

**Properties:**

- **No race conditions** — only one merge per repo at a time
- **Maximum parallelism** — different repos merge simultaneously
- **No file-based locks** — managed in engine memory, no cleanup needed
- **No deadlocks** — merges are independent, no circular waits
- **Fast queue drain** — step-boundary merges are small diffs, complete quickly

In single-repo mode, the per-repo queue is effectively a global queue — step
merges from different tasks serialize. This matches today's behavior.

**Why not a global merge queue?** A global queue would block Task A's
shared-libs merge while Task B's api-service merge runs, even though they're
in different repos. Per-repo queues eliminate this unnecessary serialization.

#### 2.4 Wave-Boundary Safety Sweep

The wave-level merge goes away for multi-segment tasks — it's replaced by
step-level merges. But at the wave boundary (all tasks done), a safety sweep
runs:

1. **Verify no unstaged/uncommitted files** in any worktree across all repos
2. **Run full test suite** on the orch branch (cross-repo integration check)
3. **Verify .DONE files** exist for all completed tasks
4. **Auto-commit any straggler artifacts** (STATUS.md updates, review files)

This catches anything that fell through the step-level merges. It's a
verification pass, not a merge — the merges already happened at step boundaries.

For single-segment tasks, the existing wave merge model is preserved unchanged.
Mixed batches (single + multi-segment tasks) use step merges for multi-segment
tasks and the wave safety sweep covers everything.

### 3. Segment Concurrency

#### 3.1 Configuration

Two separate settings control concurrency:

- **`maxLanes`** — max concurrent *tasks* in a wave (unchanged)
- **`maxSegmentConcurrency`** — max concurrent *segments* within a single
  step of a task (new setting)

These are independent. A workspace with 8 repos might want:
- `maxLanes=4` — 4 tasks at a time in a wave
- `maxSegmentConcurrency=8` — a single task can use all 8 repos in parallel

Default: `maxSegmentConcurrency` = `maxLanes` (a sensible starting point).

#### 3.2 Overflow Handling

If a step has more segments than `maxSegmentConcurrency` allows:

```
Step 1 has 6 segments, maxSegmentConcurrency = 4:

  Round 1: Launch 4 segments (parallel)
  ├── shared-libs    → running
  ├── api-service    → running
  ├── web-client     → running
  ├── auth-service   → running
  ├── data-service   → queued
  └── notification   → queued

  As each finishes, launch next queued:
  ├── shared-libs    → done → launch data-service
  └── api-service    → done → launch notification

  All 6 complete → step-boundary merge
```

The engine manages the queue. Segments are launched in declaration order
(matching PROMPT.md ordering). The step is complete only when ALL segments
finish, regardless of how many ran in parallel.

#### 3.3 Dashboard Display for Queued Segments

```
Step 1: Create cross-repo utilities (4/6 segments active)
├─ 🟢 shared-libs     👁  ● succeeded  1m 22s  ━━━━━━━━  100% 2/2
├─ 🟢 api-service     👁  ● running    0m 45s  ━━━━━━━━  50%  1/2
├─ 🟢 web-client      👁  ● running    0m 30s  ━━━━━━━━  0%   0/2
├─ 🟢 auth-service    👁  ● running    0m 15s  ━━━━━━━━  0%   0/1
├─ ⏳ data-service          ○ queued
└─ ⏳ notification          ○ queued
```

Queued segments show as greyed out with a queue indicator. When a slot opens,
they transition to running with their own telemetry.

#### 3.4 Upper Limit

The create-taskplane-task skill enforces a maximum of **10 segments per task**.
Tasks requiring more than 10 repos should be split into separate tasks with
dependencies.

This is a skill-level guideline, not an engine-level hard limit. The engine
can handle more, but task quality degrades as segment count grows (more
coordination, more merge points, harder to reason about).

### 4. Parallel Segment Execution Rules

Segments within a step run in parallel because they execute in isolated
repo worktrees. This is a precondition that task authors must respect:

**Parallel-safe (segments are independent):**
```markdown
### Step 1: Create consumers of shared utility

#### Segment: web-client
- [ ] Create src/api/client.js using string-utils

#### Segment: api-service
- [ ] Create src/middleware/logger.js using string-utils
```

Both consume shared-libs output (from a prior step), both write to different
repos. Safe to parallelize.

**NOT parallel-safe (segment B depends on segment A):**
```markdown
### Step 1: BAD — these cannot run in parallel

#### Segment: shared-libs
- [ ] Create src/string-utils.js     ← api-service needs this

#### Segment: api-service
- [ ] Import string-utils from shared-libs  ← can't see it until merge
```

The api-service segment cannot see shared-libs changes until the step-boundary
merge. These belong in sequential steps:

```markdown
### Step 1: Create shared utility
#### Segment: shared-libs
- [ ] Create src/string-utils.js

### Step 2: Create consumer
#### Segment: api-service
- [ ] Import string-utils from shared-libs
```

**Cross-repo visibility rule:** A segment can only see another repo's changes
if those changes were merged in a *prior* step's step-boundary merge. Within
a step, segments are completely isolated — each sees only its own repo's
worktree state (based on the orch branch HEAD at step start).

### 5. STATUS.md Format

STATUS.md mirrors the segment structure within each step:

```markdown
### Step 1: Create utilities and API client
**Status:** 🟡 In Progress

#### Segment: shared-libs
- [x] Create src/string-utils.js
- [x] JSDoc comments

#### Segment: web-client
- [ ] Create src/api/client.js
- [ ] JSDoc comments
```

Each segment's worker only checks off its own segment's boxes. The lane-runner
presents only the relevant `#### Segment: <repoId>` block to each worker.
The step is "complete" when ALL segments' checkboxes within that step are
checked.

### 6. Worker Experience

When a worker spawns for a specific segment, the lane-runner:

1. Identifies the active segment's repoId
2. Extracts only that segment's checkboxes from the current step
3. Injects segment context into the iteration prompt:

```
Active segment: TP-005::api-service (Step 2, segment 2 of 2)
Your repo: api-service
Your checkboxes for this step:
  - [ ] Create src/middleware/logger.js
  - [ ] Import formatLogEntry from shared-libs
  - [ ] Log request method, path, timing

Prior steps completed: Step 0 (preflight), Step 1 (shared-libs utility created)
When all YOUR checkboxes are checked, your segment is done — exit successfully.
Do NOT attempt work in other repos.
```

The worker sees only its checkboxes, knows what prior steps accomplished, and
has a clear exit condition.

### 7. Reviews Within Segments

Reviews happen **within each segment's worker flow**, not at the step boundary
across segments:

1. Each segment's worker independently calls `review_step` for its work
2. The reviewer sees that segment's plan and code changes in the repo worktree
3. APPROVE/REVISE cycle happens per-segment, in parallel across segments
4. The step-boundary merge verification provides the cross-repo quality gate
   (runs tests after merging all segments for the step)

This means a step with 3 segments could have 3 independent plan reviews and
3 independent code reviews running in parallel. The merge verification after
the step catches any cross-repo integration issues that per-segment reviews
couldn't see.

### 8. Progress Tracking and Stall Detection

#### 8.1 Segment-Level Progress

```typescript
interface SegmentProgress {
  segmentId: string;
  repoId: string;
  stepNumber: number;
  checked: number;
  total: number;
  status: "pending" | "queued" | "running" | "succeeded" | "failed";
}
```

#### 8.2 Step-Level Progress (Aggregate)

The step's progress is the sum of all its segments' checkboxes. The step is
complete when all segments report all checkboxes checked.

#### 8.3 Stall Detection (Segment-Scoped)

Stall detection only counts the **current segment's checkboxes**. A worker
in the shared-libs segment is not penalized for unchecked web-client boxes.
This eliminates the false-stall loop that plagued polyrepo testing.

### 9. Dashboard Representation

#### 9.1 Active Step with Parallel Segments

```
Step 1: Create utilities and API client          3/6 segments active
├─ 🟢 shared-libs   👁  ● running    1m 22s  ━━━━━━━━  50% 2/4
├─ 🟢 api-service   👁  ● running    0m 45s  ━━━━━━━━  33% 1/3
├─ 🟢 web-client    👁  ● succeeded  2m 01s  ━━━━━━━━  100% 3/3
├─ ⏳ auth-service        ○ queued
└─ Step progress: 60% (6/10)
```

#### 9.2 👁 Status Viewer

Clicking 👁 on a segment shows that segment's checkboxes from STATUS.md —
only the `#### Segment: <repoId>` block for the selected segment, not the
full STATUS.md. This gives a focused view of what that specific worker is
doing.

#### 9.3 Step-Level Progress Bar

The step-level progress bar shows the aggregate across all segments. The wave
indicator chips at the top of the dashboard could show step progress within
each wave for multi-segment tasks.

### 10. Dynamic Segment Expansion

When a worker discovers cross-repo work at runtime, it files an expansion
request with step definitions. Dynamic expansion **always creates a new step**
immediately after the current step.

#### 10.1 Expansion Request Format

```typescript
interface SegmentExpansionRequest {
  taskId: string;
  fromSegmentId: string;
  requestedRepoIds: string[];
  // Step definitions for the new step
  steps: ExpandedStepDefinition[];
  // Context from the discovering worker for the next worker
  context?: string;
}

interface ExpandedStepDefinition {
  name: string;
  segments: {
    repoId: string;
    checkboxes: string[];
  }[];
}
```

#### 10.2 Example

Worker on shared-libs Step 1 discovers api-service needs a config change:

```json
{
  "taskId": "TP-007",
  "fromSegmentId": "TP-007::shared-libs",
  "requestedRepoIds": ["api-service"],
  "steps": [
    {
      "name": "Update api-service configuration",
      "segments": [
        {
          "repoId": "api-service",
          "checkboxes": [
            "Add shared-libs dependency to api-service/package.json",
            "Update api-service/src/config.js to import shared utility",
            "Run api-service tests to verify integration"
          ]
        }
      ]
    }
  ],
  "context": "shared-libs now exports formatLogEntry(level, message, meta). api-service needs to import and use it in the logger middleware."
}
```

#### 10.3 Expanded Step Naming and Placement

Expanded steps use sub-numbering: `Step 1.1`, `Step 1.2`, etc. The engine
inserts the expanded step immediately after the step that triggered the
expansion. Ordering: `Step 1 < Step 1.1 < Step 1.2 < Step 2`.

**Why always immediately after?** The discovering worker has context about
what's needed *now*. It cannot predict needs 2-3 steps ahead. If cascading
discoveries occur, each step's worker expands for the next step — building
the chain incrementally.

#### 10.4 Prerequisite Edge Case

If a worker discovers that a parallel segment within the **same step** needed
prerequisite work that wasn't done, it's too late — that segment already ran
(or is running). Segments within a step are fully parallel; there is no
mechanism to inject a prerequisite mid-step. The correct response is to create
an expansion step (e.g., Step 1.1) to fix the issue after the current step
merges.

#### 10.5 Backward Compatibility

If an expansion request has no `steps` field (old format), the lane-runner
falls back to presenting the full remaining STATUS.md steps — the worker
will need to figure out what to do. Suboptimal but preserves compatibility.

### 11. Discovery: Parse Segment-Step Mapping

`discovery.ts` parses `#### Segment: <repoId>` markers within each step and
builds a mapping:

```typescript
interface StepSegmentMapping {
  stepNumber: number;
  stepName: string;
  segments: {
    repoId: string;
    checkboxes: string[];
  }[];
}
```

**Backward compatibility:** Steps without `#### Segment:` markers produce a
single segment entry with the task's primary repoId (the packet repo).

**Ambiguous segment references:** If a segment repoId doesn't match any repo
in the workspace config, the discovery parser should:
1. Attempt fuzzy matching (case-insensitive, common abbreviations)
2. If no match found, flag as a warning (not fatal — let the worker try to
   infer at runtime)
3. The worker escalates to the supervisor if it can't resolve the reference

### 12. Create-Taskplane-Task Skill: Pre-Decomposition

The skill should pre-decompose steps into segments when creating multi-repo
tasks. This minimizes dynamic expansion by predicting cross-repo work upfront.

#### 12.1 Skill Workflow

1. Read workspace config to know available repos and their roles
2. Analyze task description and file scope per repo
3. Group work into steps by logical goal, with explicit segments per repo
4. Order steps respecting cross-repo dependencies:
   - Shared libraries / common code → early steps
   - Per-repo implementation → middle steps (parallel where possible)
   - Integration testing / documentation → final steps
5. Write PROMPT.md with `#### Segment: <repoId>` markers within every step
6. Write STATUS.md with matching structure

#### 12.2 Explicit Segments Always

The skill should **always** include explicit `#### Segment: <repoId>` markers
in multi-repo tasks, even for steps that only touch one repo. This is better
for historical reference and makes the task structure self-documenting. The
packet-repo fallback for unmarked steps exists for backward compatibility,
not as a recommended practice.

#### 12.3 When Pre-Decomposition Isn't Possible

Some tasks genuinely can't predict cross-repo needs. The skill should:
- Note in PROMPT.md that dynamic expansion may be needed
- Include guidance in the primary segment: "If you discover cross-repo
  changes are needed, use `request_segment_expansion` with step definitions"

#### 12.4 Upper Limit

The skill enforces a maximum of **10 segments per task** as a guideline.
Tasks requiring more should be split into separate tasks with dependencies.
This is a skill-level recommendation, not an engine hard limit.

### 13. Worker Prompt Changes

Add to `templates/agents/task-worker.md`:

```markdown
## Multi-Segment Tasks

You may be executing one segment of a multi-segment step. Your iteration
prompt tells you which segment is active and which checkboxes are yours.

**Rules:**
- Only work on checkboxes listed for your current segment
- When all your segment's checkboxes are checked, your work is done — exit
- Do NOT attempt to modify files in repos not in your worktree
- If you discover work needed in another repo, use `request_segment_expansion`
  with step definitions describing what the next step's worker should do
- Include a `context` field with knowledge the next worker will need

**Segment reference resolution:**
If your iteration prompt references a segment repoId you don't recognize,
check the workspace config for similar names. If you can confidently infer
the correct repo, proceed. If you're unsure, escalate to the supervisor —
do not guess on repo targeting.

**Context from prior segments:**
If your prompt includes "Context from prior segment," this was written by
a worker who discovered the need for your work. Use it to understand what
was built and what you need to do.
```

### 14. Documentation/Delivery Step Convention

The final documentation/delivery step should always run in the **packet repo**
(where STATUS.md and PROMPT.md live). This is where task artifacts are
finalized, discoveries logged, and completion status recorded.

The skill should always generate the final step with `#### Segment: <packet-repo>`.
If the packet repo is the same as the primary repo (the common case), this is
natural. If the packet repo differs from execution repos, the final step ensures
task artifacts are updated in the right location.

---

## Migration & Backward Compatibility

| Scenario | Behavior |
|----------|----------|
| Single-segment tasks (no markers) | No change — all checkboxes shown to single worker |
| Multi-segment tasks without markers | Legacy mode — all steps shown, fallback to packet repo |
| Multi-segment tasks with markers | Segment-scoped filtering, parallel execution, step merges |
| Dynamic expansion without step defs | Legacy mode for expanded segment |
| Dynamic expansion with step defs | New sub-step inserted with segment checkboxes |

---

## Implementation Plan

### Phase 1: Segment-scoped step filtering (highest impact, lowest risk)

- Parse `#### Segment: <repoId>` markers in discovery.ts
- Lane-runner filters checkboxes by active segment's repoId
- Segment-scoped progress counting and stall detection
- Worker exits cleanly when segment checkboxes are done
- Iteration prompt includes segment context

**Unblocks:** Workers stop trying to do cross-repo work

### Phase 2: Step-boundary merges and per-repo serialization

- After all segments within a step complete, merge into orch branch
- Per-repo merge queue in engine (one merge at a time per repo)
- Provision new worktrees from merged orch branch for next step
- Verification (tests) at step-boundary merge point
- Wave-boundary safety sweep (unstaged files, test suite, .DONE verification)

**Unblocks:** Later steps can see earlier steps' cross-repo changes

### Phase 3: Segment concurrency control

- Add `maxSegmentConcurrency` setting to taskplane-config.json
- Engine queues overflow segments within a step
- Launch queued segments as slots open
- Step completes only when all segments (including queued) finish

**Unblocks:** Controlled resource usage for wide multi-repo tasks

### Phase 4: Dynamic expansion with step definitions

- Extend `request_segment_expansion` with steps, segments, and context
- Engine stores step definitions in segment record
- Lane-runner injects expanded step definitions into worker prompt
- Expanded step naming: Step N.1, N.2, etc.
- Context field passed from discovering worker to executing worker

**Unblocks:** Runtime-discovered cross-repo work with proper guidance

### Phase 5: Skill pre-decomposition

- Update create-taskplane-task skill to detect multi-repo tasks
- Add segment grouping within steps (always explicit)
- Repo ordering heuristics (shared → backend → frontend → docs)
- Generate PROMPT.md and STATUS.md with segment markers
- Enforce 10-segment-per-task guideline

**Unblocks:** Task authors get correct segment structure by default

### Phase 6: Dashboard segment progress

- Per-segment progress bars within step view
- Parallel segment display (stacked within step)
- Queued segment indicators
- Segment-level 👁 STATUS.md viewer (shows only that segment's block)
- Step-level aggregate progress bar

**Unblocks:** Operator visibility into multi-segment progress

---

## References

- #492: Engine does not advance frontier after non-final segment
- #495: Worker prompt should indicate which steps belong to current segment
- #496: Multi-segment task format: steps must be organized by segment/repo
- TP-165: Segment boundary .DONE guard (shipped)
- TP-169: Segment expansion resume crash (shipped)
