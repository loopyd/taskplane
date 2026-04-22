# TP-143: Engine Segment Graph Mutation — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-06
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 2
**Size:** M

---

### Step 0: Preflight
**Status:** Pending
- [ ] Read PROMPT.md and STATUS.md
- [ ] Read spec sections 3, 3a, 4, 5, 6, 7
- [ ] Read engine.ts segment frontier logic
- [ ] Read resume.ts reconstruction
- [ ] Understand segment lifecycle

### Step 1: Outbox consumption
**Status:** Pending
- [ ] Check for request files after segment completes
- [ ] Parse SegmentExpansionRequest
- [ ] Handle malformed files (.invalid)
- [ ] Discard on failed segment (.discarded)
- [ ] Process in requestId order
- [ ] R002: consume sorted valid requests through a concrete boundary-processing path
- [ ] R002: scope failed-segment discard to matching taskId/fromSegmentId only
- [ ] R002: reject empty requestedRepoIds as malformed (.invalid)

### Step 2: Engine validation
**Status:** Pending
- [ ] Repo existence check
- [ ] Cycle detection
- [ ] Task not terminal
- [ ] Placement valid
- [ ] Idempotency guard
- [ ] Validation failure path: rename to .rejected and emit segment-expansion-rejected alert
- [ ] Validation success path: hand off to graph-mutation path
- [ ] Validation branch smoke coverage (reject + accept)

### Step 3: DAG mutation with rewiring
**Status:** Pending
- [ ] Formal rewiring algorithm (roots/sinks/S_old)
- [ ] after-current rewiring
- [ ] end placement
- [ ] Repeat-repo disambiguated IDs
- [ ] Re-topologize orderedSegments
- [ ] Update SegmentFrontierTaskState
- [ ] Post-mutation scheduling continuity (expanded pending segments remain executable)
- [ ] Step 3 scheduling continuity test intent (targeted coverage)

### Step 4: Persistence and alerts
**Status:** Pending
- [ ] Persist new segments to batch state
- [ ] Persist expansion provenance (`expandedFrom`, `expansionRequestId`) on new segment records
- [ ] Update segmentIds[]
- [ ] Record processed requestId
- [ ] Crash-safe approval ordering: durable persistence + idempotency audit before `.processed` rename
- [ ] Emit supervisor alert (include before/after segment lists)
- [ ] Rename request file
- [ ] Worktree provisioning
- [ ] Step 4 approval-path persistence/lifecycle targeted test intent
- [ ] R012: resync persisted segment dependency records after each approved mutation (multi-request same boundary) and cover with runtime test

### Step 5: Resume compatibility
**Status:** Pending
- [ ] Resume reconstructs expanded segments
- [ ] Expanded segments are behaviorally indistinguishable from original segments after resume (deps/lifecycle/metadata parity)
- [ ] Approved-but-unexecuted expansion resumes
- [ ] Idempotency on resume (processed request files/request IDs do not replay)
- [ ] Step 5 resume-specific targeted test intent (approved-but-unexecuted + processed-file replay)
- [ ] R016: rebuild resume continuation rounds in grouped wave form (multi-task parity) and add multi-task/idempotency resume tests

### Step 6: Testing & Verification
**Status:** Pending
- [ ] Create/extend `extensions/tests/segment-expansion-engine.test.ts` coverage target
- [ ] All mutation tests (linear, fan-out, end, repeat-repo)
- [ ] Deterministic ordering for multiple requests at the same boundary
- [ ] End placement with multiple current terminals
- [ ] Rejection tests (unknown repo, cycle, duplicate)
- [ ] Failed-origin segment requests are discarded without frontier mutation
- [ ] Edge cases (malformed, multi-request, idempotency)
- [ ] Resume after expansion
- [ ] Full test suite passing
- [ ] Polyrepo regression check

### Step 7: Documentation & Delivery
**Status:** Pending
- [ ] JSDoc
- [ ] Update STATUS.md

---

## Notes

- Reviewer suggestion (R002): consider extracting boundary outbox consumption into a dedicated helper for readability/testability.
- Reviewer suggestion (R004): keep Step 2 validation in `processSegmentExpansionRequestAtBoundary(...)` for ordering/scoping continuity.
- Reviewer suggestion (R004): consider validating request edges against requested repos before cycle checks for clearer rejection reasons.
- Reviewer suggestion (R007): clarify `end` placement for multi-root inserts (terminals connect to all roots(N)).
- Reviewer suggestion (R007): keep re-topology tie-breaks deterministic (existing order + segmentId).
- Reviewer suggestion (R010): keep approval processing in the same boundary-processing path for deterministic ordering and file lifecycle handling.
- Reviewer suggestion (R012): preserve current crash-safe ordering (persist + idempotency audit before `.processed` rename) while fixing multi-request persistence correctness.
- Reviewer suggestion (R014): validate resume idempotency from persisted request-audit records (not mailbox filename state alone).
- Reviewer suggestion (R014): consider a multi-request same-boundary resume scenario so Step 4 R012 dependency resync remains correct after reconstruction.
- Reviewer suggestion (R016): add a multi-request same-boundary-before-restart scenario to validate grouped continuation-wave reconstruction end-to-end.
- Reviewer suggestion (R018): label duplicate requestId coverage explicitly as idempotency/no-op behavior.

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-05 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-06 03:12 | Task started | Runtime V2 lane-runner execution |
| 2026-04-06 03:12 | Step 0 started | Preflight |
| 2026-04-06 03:26 | Step 0 completed | Preflight |
| 2026-04-06 03:26 | Step 1 started | Outbox consumption |
| 2026-04-06 03:41 | Step 1 completed | Outbox consumption |
| 2026-04-06 03:41 | Step 2 started | Engine validation |
| 2026-04-06 03:14 | Review R001 | plan Step 1: APPROVE |
| 2026-04-06 03:22 | Review R002 | code Step 1: REVISE |
| 2026-04-06 03:49 | Review R003 | code Step 1: APPROVE |
| 2026-04-06 03:50 | Review R004 | plan Step 2: REVISE |
| 2026-04-06 03:51 | Review R005 | plan Step 2: APPROVE |
| 2026-04-06 04:06 | Step 2 completed | Engine validation |
| 2026-04-06 04:06 | Step 3 started | DAG mutation with rewiring |
| 2026-04-06 03:28 | Review R003 | code Step 1: APPROVE |
| 2026-04-06 03:30 | Review R004 | plan Step 2: REVISE |
| 2026-04-06 03:31 | Review R005 | plan Step 2: APPROVE |
| 2026-04-06 03:37 | Review R006 | code Step 2: APPROVE |
| 2026-04-06 03:40 | Review R007 | plan Step 3: REVISE |
| 2026-04-06 03:41 | Review R008 | plan Step 3: APPROVE |
| 2026-04-06 03:45 | Worker iter 1 | done in 1961s, tools: 148 |
| 2026-04-06 03:55 | Review R009 | code Step 3: APPROVE |
| 2026-04-06 03:56 | Step 3 completed | DAG mutation with rewiring |
| 2026-04-06 03:56 | Step 4 started | Persistence and alerts |
| 2026-04-06 03:57 | Review R010 | plan Step 4: REVISE |
| 2026-04-06 03:58 | Review R011 | plan Step 4: APPROVE |
| 2026-04-06 04:08 | Review R012 | code Step 4: REVISE |
| 2026-04-06 04:11 | Review R013 | code Step 4: APPROVE |
| 2026-04-06 04:12 | Step 4 completed | Persistence and alerts |
| 2026-04-06 04:12 | Step 5 started | Resume compatibility |
| 2026-04-06 04:12 | Review R014 | plan Step 5: REVISE |
| 2026-04-06 04:12 | Review R015 | plan Step 5: APPROVE |
| 2026-04-06 04:23 | Review R016 | code Step 5: REVISE |
| 2026-04-06 04:28 | Review R017 | code Step 5: APPROVE |
| 2026-04-06 04:29 | Step 5 completed | Resume compatibility |
| 2026-04-06 04:29 | Step 6 started | Testing & Verification |
| 2026-04-06 04:29 | Review R018 | plan Step 6: REVISE |
| 2026-04-06 04:31 | Review R019 | plan Step 6: APPROVE |
| 2026-04-06 04:47 | Review R020 | code Step 6: APPROVE |
| 2026-04-06 04:48 | Step 6 completed | Testing & Verification |
| 2026-04-06 04:48 | Step 7 started | Documentation & Delivery |
| 2026-04-06 04:50 | Step 7 completed | Documentation & Delivery |
| 2026-04-06 04:49 | Worker iter 2 | done in 3867s, tools: 299 |
| 2026-04-06 04:49 | Task complete | .DONE created |
