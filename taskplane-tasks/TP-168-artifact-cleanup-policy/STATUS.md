# TP-168: Artifact Cleanup Policy — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-12
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight
**Status:** Pending

- [ ] Read cleanup.ts — current cleanup functions and coverage
- [ ] Read extension.ts — where cleanup is called
- [ ] Identify all artifact types and gaps
- [ ] Document findings

**Findings:**
- cleanup.ts has 3 layers: (1) post-integrate batch-scoped, (2) age-based preflight sweep, (3) size-capped log rotation
- Age sweep (Layer 2) currently: 7 days, only covers telemetry/*.jsonl, *-exit.json, lane-prompt-*.txt, merge-result-*, merge-request-*, mailbox batch dirs, context-snapshot dirs
- GAPS: Does NOT sweep `.pi/verification/` files, `.pi/worker-conversation-*.jsonl`, `.pi/lane-state-*.json`
- No telemetry directory size cap exists
- No batch-start cleanup of prior batch artifacts
- `runPreflightCleanup` is defined in cleanup.ts but only imported (unused) in engine.ts; engine.ts calls sweepStaleArtifacts + rotateSupervisorLogs separately
- extension.ts imports sweepStaleArtifacts/rotateSupervisorLogs but never calls them (unused imports)
- engine.ts lines 2012-2043 is the actual preflight cleanup site (in engine `startBatch`)
- Post-integrate cleanup called from extension.ts:1412 (supervisor auto-integrate) and extension.ts:3330 (manual /orch-integrate)
- `formatPreflightCleanup` hardcodes ">7 days old" text that needs updating when threshold changes
- `formatPreflightSweep` also hardcodes ">7 days old"
- No existing cleanup unit tests (cleanup-resilience.test.ts tests worktree/branch cleanup, not artifact cleanup)

---

### Step 1: Expand Age Sweep Scope
**Status:** Pending

- [ ] Reduce telemetry age to 3 days
- [ ] Add verification/ to sweep
- [ ] Add worker-conversation-*.jsonl to sweep
- [ ] Add lane-state-*.json to sweep
- [ ] Run targeted tests
- [ ] R002: Fix verification cleanup to sweep per-op subdirectories (not top-level files)

---

### Step 2: Add Size Cap and Batch-Start Cleanup
**Status:** Pending

- [ ] Implement telemetry size cap (500MB, oldest-first eviction)
- [ ] Wire size cap into preflight cleanup (engine.ts batch-start path)
- [ ] Add batch-start cleanup for prior completed batch artifacts (never delete active batch)
- [ ] Make thresholds clearly documented as named exported constants
- [ ] Run targeted tests

---

### Step 3: Testing & Verification
**Status:** Pending

- [ ] FULL test suite passing
- [ ] Tests for expanded age sweep
- [ ] Tests for size cap eviction
- [ ] Tests for batch-start cleanup
- [ ] All failures fixed

---

### Step 4: Documentation & Delivery
**Status:** Pending

- [ ] Docs reviewed — no doc changes needed (cleanup thresholds are internal constants, not user-configurable)
- [ ] Discoveries logged

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|
| `runPreflightCleanup`/`formatPreflightCleanup` imported but never called in engine.ts (individual functions used instead) | Left as-is — unused imports, minor tech debt | `extensions/taskplane/engine.ts:26` |
| `sweepStaleArtifacts`/`rotateSupervisorLogs` imported but never called in extension.ts | Left as-is — unused imports, minor tech debt | `extensions/taskplane/extension.ts:35` |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-12 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-12 00:43 | Task started | Runtime V2 lane-runner execution |
| 2026-04-12 00:43 | Step 0 started | Preflight |
| 2026-04-12 01:06 | Worker iter 1 | done in 1371s, tools: 117 |
| 2026-04-12 01:06 | Task complete | .DONE created |

---

## Blockers

*None*

---

## Notes

GitHub issue: #296
| 2026-04-12 00:46 | Review R001 | plan Step 1: APPROVE |
| 2026-04-12 00:49 | Review R002 | code Step 1: REVISE |
| 2026-04-12 00:51 | Review R003 | code Step 1: APPROVE |
| 2026-04-12 00:52 | Review R004 | plan Step 2: REVISE |
| 2026-04-12 00:53 | Review R005 | plan Step 2: APPROVE |
| 2026-04-12 01:01 | Review R006 | code Step 2: APPROVE |
