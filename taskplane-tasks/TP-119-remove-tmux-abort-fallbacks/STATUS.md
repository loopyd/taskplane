# TP-119: Remove TMUX Abort Fallbacks — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-02
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** S

---

### Step 0: Preflight
**Status:** ⬜ Not Started
- [ ] Read PROMPT.md and STATUS.md
- [ ] Inventory remaining TMUX helper call sites
- [ ] Classify each call site
- [ ] Log inventory in STATUS.md

### Step 1: Remove abort TMUX fallbacks
**Status:** ⬜ Not Started
- [ ] abort.ts TMUX kill paths
- [ ] execution.ts TMUX fallbacks in stop-all and stall kill
- [ ] merge.ts dual kill paths

### Step 2: Remove resume TMUX fallbacks
**Status:** ⬜ Not Started
- [ ] resume.ts TMUX reconnect paths
- [ ] Ensure V2 reconnect is only path

### Step 3: Remove dead TMUX helpers
**Status:** ⬜ Not Started
- [ ] Remove tmuxHasSession, tmuxKillSession, tmuxAsync
- [ ] Remove sessions.ts helpers
- [ ] Remove TMUX imports

### Step 4: Tests
**Status:** ⬜ Not Started
- [ ] Update tests
- [ ] Run full suite
- [ ] Fix all failures

### Step 5: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update STATUS.md
- [ ] Update migration docs

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
