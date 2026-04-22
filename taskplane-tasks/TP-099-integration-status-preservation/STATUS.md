# TP-099: Integration STATUS.md Preservation ��� Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-03-29
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight
**Status:** Pending

- [ ] Read checkpoint commit and orch_integrate flow
- [ ] Read GitHub issue #356

---

### Step 1: Diagnose rebase/merge conflict
**Status:** Pending

**Root cause: H2 CONFIRMED — merge.ts artifact staging overwrite**

Diagnosis results:
- [ ] **Case A (FF)**: STATUS.md preserved ✅ — no issue with direct FF
- [ ] **Case B3 (Rebase conflict)**: REBASE CONFLICT when both branches modify STATUS.md
- [ ] **Case C2 (Squash after overwrite)**: STATUS.md LOST, .DONE MISSING — artifact staging overwrote
- [ ] **Case D (Isolation)**: ROOT CAUSE CONFIRMED — `copyFileSync` from `repoRoot` overwrites correct STATUS.md

**Authoritative drop point:** `merge.ts` line ~1841, artifact staging copies from `repoRoot` (main working dir) into merge worktree, overwriting correctly-merged STATUS.md from lane branches.

**Fix approach:** In `merge.ts` artifact staging, skip overwriting files that already exist in the merge worktree with content from the lane merge. Only stage artifacts that are NOT already present from the lane merge (e.g., .DONE files that were only in the main working dir).

---

### Step 2: Implement STATUS.md preservation
**Status:** 🟡 In Progress

**Fix:** Modify artifact staging in `merge.ts` to never overwrite files already in `mergeWorkDir` from lane merge.

**TP-035 allowlist unchanged:** `.DONE`, `STATUS.md`, `REVIEW_VERDICT.json` (no expansion).

**Algorithm:**
1. Build allowlisted paths from lane task folders (same as today).
2. For each `relPath`:
   - `destPath = join(mergeWorkDir, relPath)`
   - **If `destPath` exists** → **skip** (lane merge already brought correct version).
   - **If `destPath` missing** → backfill: primary source = `join(lane.worktreePath, relPath)`, fallback = `join(repoRoot, relPath)`. Apply resolve/relative containment check on source.
   - `git add` only changed/new files.
3. Commit if staged (same checkpoint commit as today).

**Path safety:** All sources use `resolve()` + `relative()` containment (TP-035 hardening preserved).

- [ ] Fix merge.ts artifact staging to skip files already present from lane merge
- [ ] Add lane worktree backfill for missing artifacts (.DONE, REVIEW_VERDICT.json)
- [ ] Maintain path containment checks for all source paths

---

### Step 3: Testing & Verification
**Status:** Pending

- [ ] Integration tests for STATUS.md preservation
- [ ] Integration tests for .DONE preservation
- [ ] Integration tests for .reviews/ preservation (.reviews/ not in TP-035 allowlist, not applicable)
- [ ] Full test suite passing (3090/3090 pass)

---

### Step 4: Documentation & Delivery
**Status:** Pending

- [ ] Log discoveries

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|
| R001 | Plan | Step 1 | REVISE | .reviews/R001-plan-step1.md |
| R002 | plan | Step 1 | APPROVE | .reviews/R002-plan-step1.md |
| R003 | plan | Step 2 | REVISE | .reviews/R003-plan-step2.md |
| R004 | plan | Step 2 | UNKNOWN | .reviews/R004-plan-step2.md |
| R005 | code | Step 2 | APPROVE | .reviews/R005-code-step2.md |

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|
| No `git rebase` in code — root cause is H2 (artifact staging overwrite) not H1 | Fixed | extensions/taskplane/merge.ts:1841 |
| merge.ts artifact staging copies from `repoRoot` (main working dir) which has OLD STATUS.md | Fixed — skip existing files, backfill from lane worktree | extensions/taskplane/merge.ts |
| `.reviews/` directory is NOT in TP-035 allowlist — only .DONE, STATUS.md, REVIEW_VERDICT.json | Noted — no change to allowlist scope | extensions/taskplane/merge.ts |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-03-29 | Task staged | PROMPT.md and STATUS.md created |
| 2026-03-29 | Step 0 complete | Traced integration flow, read issue #356 |
| 2026-03-29 | Step 1 plan revised | R001 feedback: expanded diagnosis matrix |
| 2026-03-29 21:44 | Review R002 | plan Step 1: APPROVE |
| 2026-03-29 21:52 | Reviewer R003 | persistent reviewer dead — respawning for plan review (1/3) |
| 2026-03-29 21:54 | Review R003 | plan Step 2: REVISE |
| 2026-03-29 21:55 | Reviewer R004 | persistent reviewer dead — respawning for plan review (2/3) |
| 2026-03-29 21:55 | Reviewer R004 | persistent reviewer failed — falling back to fresh spawn: Persistent reviewer exited within 30s of spawn without producing a verdict — wait_for_review tool may not be supported by this model (e.g., called via bash instead of as a registered tool) |
| 2026-03-29 21:56 | Review R004 | plan Step 2: UNKNOWN (fallback) |
| 2026-03-29 21:58 | Reviewer R005 | persistent reviewer failed — falling back to fresh spawn: Persistent reviewer exited within 30s of spawn without producing a verdict — wait_for_review tool may not be supported by this model (e.g., called via bash instead of as a registered tool) |
| 2026-03-29 22:01 | Review R005 | code Step 2: APPROVE (fallback) |

---

## Blockers

*None*

---

## Notes

### Preflight Analysis

**Integration flow traced:**
1. Engine creates orch branch from main (`engine.ts`)
2. Workers execute in worktrees, update STATUS.md
3. `mergeWaveByRepo` merges lane branches into orch branch, stages task artifacts (.DONE, STATUS.md) from `repoRoot`
4. Integration via `executeIntegration` (FF/merge/PR modes)
5. For PR mode: supervisor's `handlePrLifecycle` polls CI and squash-merges

**Key code paths (no rebase found):**
- FF: `git merge --ff-only orchBranch` (extension.ts)
- Merge: `git merge orchBranch --no-edit` (extension.ts)
- PR: `git push origin orchBranch` + `gh pr create` (extension.ts)
- Supervisor merge: `gh pr merge --squash --delete-branch` (supervisor.ts)
