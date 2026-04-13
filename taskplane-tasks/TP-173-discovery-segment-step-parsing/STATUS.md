# TP-173: Discovery Segment-Step Parsing — Status

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
- [ ] Read discovery.ts PROMPT.md parser
- [ ] Read types.ts ParsedTask interface
- [ ] Read spec sections A.1 and A.10
- [ ] Document findings

---

### Step 1: Add Types
**Status:** ⬜ Not Started
- [ ] Add SegmentCheckboxGroup interface
- [ ] Add StepSegmentMapping interface
- [ ] Add stepSegmentMap to ParsedTask
- [ ] Run targeted tests

---

### Step 2: Implement Segment Parsing
**Status:** ⬜ Not Started

> ⚠️ Hydrate: Expand based on parser structure found in Step 0

- [ ] Parse `#### Segment: <repoId>` within step sections
- [ ] Collect checkboxes per segment
- [ ] Handle fallback (no markers → primary repoId)
- [ ] Handle edge cases (empty, duplicate, unknown repoId)
- [ ] Run targeted tests

---

### Step 3: Testing & Verification
**Status:** ⬜ Not Started
- [ ] FULL test suite passing
- [ ] Tests for segment markers, fallback, mixed, errors
- [ ] All failures fixed

---

### Step 4: Documentation & Delivery
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

Phase A foundation task. All other Phase A tasks depend on this.
Specification: docs/specifications/taskplane/segment-aware-steps.md
