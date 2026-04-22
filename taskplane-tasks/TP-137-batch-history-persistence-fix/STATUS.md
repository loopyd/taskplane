# TP-137: Batch History Persistence Fix — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-05
**Review Level:** 1
**Review Counter:** 0
**Iteration:** 1
**Size:** S

---

### Step 0: Preflight
**Status:** Pending
- [ ] Read PROMPT.md and STATUS.md
- [ ] Trace batch completion path
- [ ] Trace orch_integrate .pi/ file handling
- [ ] Check .gitignore for batch-history.json
- [ ] Determine root cause

### Step 1: Diagnose and fix root cause
**Status:** Pending
- [ ] Fix identified root cause
- [ ] Verify history written correctly

### Step 2: Ensure history survives integration
**Status:** Pending
- [ ] Verify after orch_integrate
- [ ] Post-integration hook if needed
- [ ] Handle resumed batch edge case

### Step 3: Tests
**Status:** Pending
- [ ] Test history written on completion
- [ ] Test history survives integration
- [ ] Test dashboard loadHistory
- [ ] Run full suite, fix failures

### Step 4: Documentation & Delivery
**Status:** Pending
- [ ] Update STATUS.md
- [ ] Close #423

---

## Execution Log

| Timestamp | Action | Outcome |
| 2026-04-05 01:30 | Task started | Runtime V2 lane-runner execution |
| 2026-04-05 01:30 | Step 0 started | Preflight |
|-----------|--------|---------|
| 2026-04-05 01:38 | Review R001 | plan Step 1: APPROVE |
| 2026-04-05 01:41 | Review R002 | plan Step 2: APPROVE |
| 2026-04-05 01:43 | Review R003 | plan Step 3: APPROVE |
| 2026-04-05 01:47 | Integration persistence hardening | Added `withPreservedBatchHistory(...)` to manual and auto integration paths |
| 2026-04-05 01:48 | Resume edge-case fix | `saveBatchHistory` now upserts by `batchId` so resumed batches reflect final outcome |
| 2026-04-05 01:52 | Verification | Targeted tests + full `tests/*.test.ts` suite passed (3152/3152) |
| 2026-04-05 01:49 | Worker iter 1 | done in 1100s, tools: 134 |
| 2026-04-05 01:49 | Task complete | .DONE created |

## Closure Notes

- Root cause: integration flow had no guard to preserve runtime `.pi/batch-history.json`; history could be clobbered by merge-side file state. Added explicit preservation wrapper around integration execution.
- Resumed batch handling improved: history now replaces prior entries for the same `batchId` to keep latest terminal result authoritative.
- Added tests:
  - `extensions/tests/batch-history-persistence.test.ts`
  - `extensions/tests/dashboard-history-load.test.ts`
  - updated `extensions/tests/mailbox-supervisor-tool.test.ts` wiring assertions.
- #423 closure note: bug conditions are addressed and verified; ready to close issue #423.
