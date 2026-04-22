# TP-116: Outcome-Embedded Telemetry — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-02
**Review Level:** 0
**Review Counter:** 0
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight
**Status:** Pending
- [ ] Read PROMPT.md and confirm understanding
- [ ] Read LaneTaskOutcome type in types.ts
- [ ] Read batch history writer in engine.ts
- [ ] Read makeResult in lane-runner.ts

### Step 1: Extend LaneTaskOutcome Type
**Status:** Pending
- [ ] Add laneNumber to LaneTaskOutcome
- [ ] Add telemetry to LaneTaskOutcome
- [ ] Both optional for backward compatibility

### Step 2: Populate in Lane-Runner
**Status:** Pending
- [ ] Populate outcome.laneNumber from config.laneNumber
- [ ] Populate outcome.telemetry from finalTelemetry
- [ ] Skipped tasks: leave telemetry undefined

### Step 3: Populate in executeLaneV2
**Status:** Pending
- [ ] Outcomes carry through laneNumber and telemetry
- [ ] Skipped outcomes: set laneNumber, no telemetry

### Step 4: Simplify Batch History Writer
**Status:** Pending
- [ ] Read telemetry from to.telemetry when available
- [ ] Fall back to lane snapshot for legacy
- [ ] Remove batchState.lanes.find() dependency
- [ ] Keep legacy sidecar fallback

### Step 5: Tests
**Status:** Pending
- [ ] Test: outcome with telemetry → correct history tokens
- [ ] Test: outcome without telemetry → snapshot fallback
- [ ] Test: skipped task → zero tokens
- [ ] All existing tests pass

### Step 6: Documentation & Delivery
**Status:** Pending
- [ ] Update STATUS.md
- [ ] Log discoveries

---

## Execution Log

| Timestamp | Action | Outcome |
| 2026-04-02 02:08 | Task started | Runtime V2 lane-runner execution |
| 2026-04-02 02:08 | Step 0 started | Preflight |
| 2026-04-02 02:14 | Implemented Step 1 | Added optional `laneNumber` + `telemetry` to `LaneTaskOutcome` |
| 2026-04-02 02:17 | Implemented Step 2 | `lane-runner` now emits embedded outcome telemetry and lane number |
| 2026-04-02 02:22 | Implemented Step 3 | Runtime V2/legacy lane outcomes now consistently carry `laneNumber` |
| 2026-04-02 02:28 | Implemented Step 4 | Batch history token resolution now prefers `outcome.telemetry` and avoids V2 string-key joins |
| 2026-04-02 03:17 | Implemented Step 5 | Added TP-116 unit tests and ran full extensions test suite (3411 passed) |
| 2026-04-02 02:23 | Agent reply | TP-116 complete in lane-1. Implemented outcome-embedded telemetry in LaneTaskOutcome (optional laneNumber + telemetry), populated in lane-runner/executeLaneV2, preserved through persistence sync/upser |
| 2026-04-02 02:23 | Worker iter 1 | done in 894s, tools: 80 |
| 2026-04-02 02:23 | Task complete | .DONE created |

---

## Discoveries

- `syncTaskOutcomesFromMonitor()` can overwrite richer outcomes unless fields are explicitly preserved; updated upsert/sync flow now retains `telemetry` and `laneNumber` when monitor snapshots lack them.
- For skipped tasks, fallback lane snapshots can incorrectly attribute lane-level cumulative tokens; explicit zero-token handling for `status === "skipped"` prevents this.
- `serializeBatchState()` now uses `outcome.laneNumber` as a fallback when the latest lane allocation map does not contain the task, improving lane attribution continuity.

---

## Blockers

*None*
