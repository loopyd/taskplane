# TP-163: Fix ENOENT when task folders are uncommitted at batch start (#471) — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-11
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 1
**Size:** S

---

### Step 0: Preflight
**Status:** Pending

- [ ] Read `ensureTaskFilesCommitted` — understand staging commit flow
- [ ] Read `executeWave` — confirm sequencing (staging before worktree creation)
- [ ] Read orch branch creation in `engine.ts` — confirm it runs before `executeWave`
- [ ] Confirm `baseBranch` param in `executeWave` is the orch branch name
- [ ] Verify test baseline

---

### Step 1: Fast-forward orch branch after staging commit
**Status:** Pending

- [ ] Add `orchBranch?: string` param to `ensureTaskFilesCommitted`
- [ ] After staging commit: get orchBranch tip SHA + HEAD SHA
- [ ] Check ancestry: if `merge-base --is-ancestor <orchTip> <newHead>` → FF case: `update-ref` with expected-old-sha
- [ ] Non-FF case (orchBranch advanced with wave merges): use `git merge-tree --write-tree <orchTip> <newHead>` to compute merged tree, then `commit-tree` to create merge commit, then `update-ref` with expected-old-sha
- [ ] Wrap entire ref-update in try/catch — non-fatal on failure (log warning)
- [ ] Pass `orchBranch` (= `baseBranch`) from `executeWave` to `ensureTaskFilesCommitted`
- [ ] Verify workspace mode correctness

---

### Step 2: Testing & Verification
**Status:** Pending

- [ ] Full test suite passing
- [ ] CLI smoke passing
- [ ] Fix all failures

---

### Step 3: Documentation & Delivery
**Status:** Pending

- [ ] Inline comment explaining the fix
- [ ] Discoveries logged

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|
| R001 | plan | 1 | REVISE | .reviews/R001-plan-step1.md |
| R002 | plan | 1 | APPROVE | .reviews/R002-plan-step1.md |
| R003 | code | 1 | APPROVE | — |

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|
| Non-FF case in wave 2+ requires `git merge-tree --write-tree` (git ≥ 2.38). If git is older, the non-FF path logs a warning and continues (worktree allocation will fail with a clearer error). | Logged in code comment | `execution.ts:ensureTaskFilesCommitted` |
| `baseBranch` in `executeWave` IS the orch branch (`batchState.orchBranch`), confirmed from engine.ts call site. | Confirmed | `engine.ts:2378` |
| Workspace mode is handled correctly: task files are committed to primary `repoRoot`; orch branch in `repoRoot` is what needs updating. | Confirmed | `execution.ts:ensureTaskFilesCommitted` |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-11 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-11 03:43 | Task started | Runtime V2 lane-runner execution |
| 2026-04-11 03:43 | Step 0 started | Preflight |
| 2026-04-11 04:01 | Worker iter 1 | done in 1094s, tools: 63 |
| 2026-04-11 04:01 | Task complete | .DONE created |

---

## Blockers

*None*
