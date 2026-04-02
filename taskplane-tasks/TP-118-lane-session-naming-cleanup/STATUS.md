# TP-118: Lane Session Naming Cleanup — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-02
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight
**Status:** ⬜ Not Started
- [ ] Read PROMPT.md and STATUS.md
- [ ] Count tmuxSessionName references
- [ ] Identify type definitions to update
- [ ] Plan alias-first approach

### Step 1: Type alias introduction
**Status:** ⬜ Not Started
- [ ] Add laneSessionId alias to types
- [ ] Rename generateTmuxSessionName → generateLaneSessionId (keep alias)
- [ ] Backward-compat state reading

### Step 2: Rename in production code
**Status:** ⬜ Not Started
- [ ] execution.ts
- [ ] engine.ts, merge.ts, extension.ts, persistence.ts, resume.ts
- [ ] Dashboard server.cjs and app.js
- [ ] naming.ts

### Step 3: Rename in tests
**Status:** ⬜ Not Started
- [ ] Update all test references
- [ ] Run full suite
- [ ] Fix all failures

### Step 4: Remove aliases
**Status:** ⬜ Not Started
- [ ] Remove tmuxSessionName from types
- [ ] Remove generateTmuxSessionName alias
- [ ] Verify full suite

### Step 5: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update STATUS.md
- [ ] Log rename count

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
