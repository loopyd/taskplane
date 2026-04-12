# TP-165: Segment Boundary .DONE Guard and Expansion Consumption — Status

**Current Step:** Step 1: Fix Premature .DONE Creation
**Status:** 🟡 In Progress
**Last Updated:** 2026-04-12
**Review Level:** 2
**Review Counter:** 1
**Iteration:** 3
**Size:** L

> **Hydration:** Checkboxes represent meaningful outcomes, not individual code
> changes. Workers expand steps when runtime discoveries warrant it.

---

### Step 0: Preflight and Root Cause Analysis
**Status:** ✅ Complete

- [x] Read engine.ts segment lifecycle: how `.DONE` is created after task completion
- [x] Read task-executor-core.ts / lane-runner.ts: where `.DONE` is written
- [x] Read engine.ts `processSegmentExpansionRequestAtBoundary` and its call site
- [x] Identify exact condition causing premature .DONE
- [x] Identify why expansion requests are not consumed
- [x] Document findings in STATUS.md

**Findings:**

**Bug #1 — Premature .DONE creation (lane-runner.ts:739-742):**
The lane-runner determines `isNonFinalSegment` by checking `unit.task.segmentIds[last] !== segmentId`. For dynamically-expanding tasks (start with 1 segment, worker files expansion request), `segmentIds.length === 1`, so `isNonFinalSegment` evaluates to false and .DONE is created prematurely. The engine's safety-net .DONE removal at engine.ts:2688-2698 uses `task.packetTaskPath || task.taskFolder` which resolves to a different path than the worktree where .DONE was actually written. Additionally, once .DONE is committed to git and merged, it propagates to subsequent worktrees.

**Bug #2 — Expansion request consumption (engine.ts:2600 + resolveTaskWorkerAgentId):**
The `resolveTaskWorkerAgentId` function falls back to `lane.laneSessionId` (e.g., `orch-henry-lane-1`) when the outcome's sessionName is absent. The actual outbox is under the WORKER agent ID (`orch-henry-lane-1-worker`). When the fallback triggers, the engine looks in the wrong directory and finds no expansion files. Additionally, the engine's .DONE removal path after expansion approval uses the wrong (non-worktree) path.

---

### Step 1: Fix Premature .DONE Creation
**Status:** ✅ Complete

- [x] Add outbox expansion-request check in lane-runner before .DONE creation — suppress .DONE if pending requests exist
- [x] Fix engine .DONE removal safety net to use worktree-resolved path (via laneByTaskId)
- [x] Run targeted tests

---

### Step 2: Fix Segment Expansion Consumption
**Status:** ⬜ Not Started

> ⚠️ Hydrate: Expand based on root cause analysis in Step 0

- [ ] Fix gating condition preventing consumption at segment boundaries
- [ ] Ensure consumed requests renamed to `.processed`
- [ ] Run targeted tests

---

### Step 3: Testing & Verification
**Status:** ⬜ Not Started

- [ ] FULL test suite passing
- [ ] Regression test: multi-segment .DONE guard
- [ ] Regression test: expansion request consumption
- [ ] All failures fixed

---

### Step 4: Documentation & Delivery
**Status:** ⬜ Not Started

- [ ] Docs reviewed for segment lifecycle references
- [ ] Discoveries logged

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-12 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-12 04:29 | Task started | Runtime V2 lane-runner execution |
| 2026-04-12 04:29 | Step 0 started | Preflight and Root Cause Analysis |
| 2026-04-12 04:50 | Worker iter 1 | done in 1262s, tools: 132 |
| 2026-04-12 04:52 | Exit intercept close | Supervisor directed session close: "STOP ANALYZING. MAKE THE EDIT NOW.
| 2026-04-12 04:52 | Worker iter 2 | done in 91s, tools: 17 |
| 2026-04-12 04:52 | Soft progress | Iteration 2: 0 new checkboxes but uncommitted source changes detected — not counting as stall |

The fix is at engine.ts line 2688. Replace this:

```
const done" |

---

## Blockers

*None*

---

## Notes

GitHub issues: #457, #452
| 2026-04-12 04:48 | Review R001 | plan Step 1: APPROVE |
