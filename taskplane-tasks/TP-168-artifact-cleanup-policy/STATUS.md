# TP-168: Artifact Cleanup Policy — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-12
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight
**Status:** ⬜ Not Started

- [ ] Read cleanup.ts — current cleanup functions and coverage
- [ ] Read extension.ts — where cleanup is called
- [ ] Identify all artifact types and gaps
- [ ] Document findings

---

### Step 1: Expand Age Sweep Scope
**Status:** ⬜ Not Started

- [ ] Reduce telemetry age to 3 days
- [ ] Add verification/ to sweep
- [ ] Add worker-conversation-*.jsonl to sweep
- [ ] Add lane-state-*.json to sweep
- [ ] Run targeted tests

---

### Step 2: Add Size Cap and Batch-Start Cleanup
**Status:** ⬜ Not Started

- [ ] Implement telemetry size cap (500MB, oldest-first eviction)
- [ ] Wire into preflight cleanup
- [ ] Add batch-start cleanup for prior batch artifacts
- [ ] Run targeted tests

---

### Step 3: Testing & Verification
**Status:** ⬜ Not Started

- [ ] FULL test suite passing
- [ ] Tests for expanded age sweep
- [ ] Tests for size cap eviction
- [ ] Tests for batch-start cleanup
- [ ] All failures fixed

---

### Step 4: Documentation & Delivery
**Status:** ⬜ Not Started

- [ ] Docs reviewed
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

---

## Blockers

*None*

---

## Notes

GitHub issue: #296
