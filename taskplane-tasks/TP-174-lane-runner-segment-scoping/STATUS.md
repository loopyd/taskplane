# TP-174: Lane-Runner Segment Scoping — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-12
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** L

---

### Step 0: Preflight
**Status:** ⬜ Not Started
- [ ] Read lane-runner.ts prompt construction and progress logic
- [ ] Read sidecar-telemetry.ts STATUS.md parsing
- [ ] Understand stepSegmentMap availability from TP-173
- [ ] Read spec sections A.2–A.5
- [ ] Document findings

---

### Step 1: Segment-Scoped Iteration Prompt
**Status:** ⬜ Not Started

> ⚠️ Hydrate: Expand based on lane-runner prompt structure found in Step 0

- [ ] Extract current segment's checkboxes from stepSegmentMap
- [ ] Inject segment context into prompt
- [ ] Filter remaining steps to current repoId
- [ ] Legacy fallback for tasks without markers
- [ ] Run targeted tests

---

### Step 2: Segment-Scoped Progress and Stall Detection
**Status:** ⬜ Not Started

> ⚠️ Hydrate: Expand based on progress tracking structure found in Step 0

- [ ] Add getSegmentCheckboxes helper
- [ ] Segment-scoped progress delta
- [ ] Segment-scoped stall detection
- [ ] Run targeted tests

---

### Step 3: Segment Exit Condition
**Status:** ⬜ Not Started
- [ ] Add isSegmentComplete helper
- [ ] Step advancement for multi-step segments
- [ ] Correct return status for non-final segments
- [ ] Run targeted tests

---

### Step 4: Sidecar Telemetry Update
**Status:** ⬜ Not Started
- [ ] Segment-scoped progress in sidecar
- [ ] Legacy fallback
- [ ] Run targeted tests

---

### Step 5: Testing & Verification
**Status:** ⬜ Not Started
- [ ] FULL test suite passing
- [ ] Segment-scoped prompt, progress, stall, exit tests
- [ ] Legacy regression tests
- [ ] All failures fixed

---

### Step 6: Documentation & Delivery
**Status:** ⬜ Not Started
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

Depends on TP-173. Core Phase A task — this is what makes workers see only their segment.
Specification: docs/specifications/taskplane/segment-aware-steps.md
