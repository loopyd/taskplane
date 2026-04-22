# TP-040: Non-Blocking Engine Refactor — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-03-23
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** L

---

### Step 0: Preflight
**Status:** Pending
- [ ] Map full control flow from /orch to wave loop
- [ ] Identify all blocking await points
- [ ] Read spec target architecture
- [ ] Understand dashboard widget update mechanism

---

### Step 1: Engine Event Infrastructure
**Status:** Pending
- [ ] Define engine event types
- [ ] Add event callback interface
- [ ] Engine emits events at state transitions
- [ ] Events written to supervisor events JSONL

---

### Step 2: Make Engine Non-Blocking
**Status:** Pending
- [ ] Refactor wave loop to not block caller
- [ ] Command handler starts engine and returns
- [ ] State communicated via events, not return value
- [ ] Dashboard updates continue working

---

### Step 3: Preserve Existing Behavior
**Status:** Pending
- [ ] /orch all still works
- [ ] /orch-status, /orch-pause, /orch-resume, /orch-abort still work
- [ ] Dashboard shows live progress
- [ ] Existing tests pass

---

### Step 4: Testing & Verification
**Status:** Pending
- [ ] Non-blocking handler test
- [ ] Event emission tests
- [ ] Completion/failure event tests
- [ ] Command compatibility tests
- [ ] Full test suite passes

---

### Step 5: Documentation & Delivery
**Status:** Pending
- [ ] Architecture docs updated
- [ ] `.DONE` created

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-03-21 | Task staged | PROMPT.md and STATUS.md created |
| 2026-03-22 | Batch execution completed | Task completed in orchestrated run; see `.reviews/` and `.DONE` |

## Blockers

*None*

## Notes

*Reserved for execution notes*
