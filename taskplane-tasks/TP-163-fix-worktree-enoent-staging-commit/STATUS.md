# TP-163: Fix ENOENT when task folders are uncommitted at batch start (#471) — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-11
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** S

---

### Step 0: Preflight
**Status:** ⬜ Not Started

- [ ] Read `ensureTaskFilesCommitted` — understand staging commit flow
- [ ] Read `executeWave` — confirm sequencing (staging before worktree creation)
- [ ] Read orch branch creation in `engine.ts` — confirm it runs before `executeWave`
- [ ] Confirm `baseBranch` param in `executeWave` is the orch branch name
- [ ] Verify test baseline

---

### Step 1: Fast-forward orch branch after staging commit
**Status:** ⬜ Not Started

- [ ] Add `orchBranch?: string` param to `ensureTaskFilesCommitted`
- [ ] After successful staging commit, fast-forward via `git update-ref`
- [ ] Wrap in try/catch — non-fatal on failure
- [ ] Pass `orchBranch` from `executeWave` to `ensureTaskFilesCommitted`
- [ ] Verify workspace mode correctness

---

### Step 2: Testing & Verification
**Status:** ⬜ Not Started

- [ ] Full test suite passing
- [ ] CLI smoke passing
- [ ] Fix all failures

---

### Step 3: Documentation & Delivery
**Status:** ⬜ Not Started

- [ ] Inline comment explaining the fix
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
| 2026-04-11 | Task staged | PROMPT.md and STATUS.md created |

---

## Blockers

*None*
