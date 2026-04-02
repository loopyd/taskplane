# TP-117: TMUX Deprecation Messaging and Dead Code Removal — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-02
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight — Inventory dead code
**Status:** ⬜ Not Started
- [ ] Read PROMPT.md and STATUS.md
- [ ] Identify dead TMUX execution functions
- [ ] Identify dead TMUX merge functions
- [ ] Identify dead TMUX session helpers
- [ ] Log inventory in STATUS.md

### Step 1: Config deprecation messaging
**Status:** ⬜ Not Started
- [ ] Mark spawn_mode: "tmux" as deprecated in config-schema
- [ ] Emit deprecation warning in config-loader
- [ ] V2-first doctor/preflight messaging

### Step 2: Remove dead execution functions
**Status:** ⬜ Not Started
- [ ] Remove executeLane()
- [ ] Remove spawnLaneSession() and TMUX spawn helpers
- [ ] Remove buildTmuxSpawnArgs() if dead
- [ ] Remove legacy spawnMergeAgent() (TMUX version)
- [ ] Update engine.ts imports
- [ ] Update other import sites

### Step 3: Remove dead session helpers
**Status:** ⬜ Not Started
- [ ] Review sessions.ts for dead functions
- [ ] Remove dead, keep abort-related

### Step 4: Tests
**Status:** ⬜ Not Started
- [ ] Update tests for removed functions
- [ ] Run full suite
- [ ] Fix all failures

### Step 5: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update STATUS.md with summary
- [ ] Log discoveries

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
