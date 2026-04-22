# TP-161: Extract task-runner utilities into taskplane library — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-11
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight — full reference inventory (BLOCKING)
**Status:** Pending

- [ ] Grep: `grep -rn "from.*task-runner" extensions/tests/`
- [ ] Grep: `grep -rn "task-runner\.ts" extensions/tests/` (source-reading tests)
- [ ] Grep: `grep -rn "task-runner" extensions/taskplane/ extensions/task-orchestrator.ts`
- [ ] Verify `isLowRiskStep` in `task-executor-core.ts`
- [ ] Verify `getSidecarDir` NOT in `execution.ts` / `lane-runner.ts`
- [ ] Run test baseline: `cd extensions && npm run test:fast`
- [ ] Document ALL findings in Discoveries table

---

### Step 1: Create extensions/taskplane/sidecar-telemetry.ts
**Status:** Pending

- [ ] Extract `SidecarTailState`, `SidecarTelemetryDelta` interfaces verbatim
- [ ] Extract `getSidecarDir`, `createSidecarTailState`, `tailSidecarJsonl` verbatim
- [ ] All exports clean (no `_` prefix)
- [ ] File compiles

---

### Step 2: Create extensions/taskplane/context-window.ts
**Status:** Pending

- [ ] Export `FALLBACK_CONTEXT_WINDOW = 200_000`
- [ ] Export `resolveContextWindow(configuredWindow: number | undefined, ctx: ExtensionContext | null)`
- [ ] Same behavior as original, adapted signature
- [ ] No task-runner type imports

---

### Step 3: Export loadAgentDef from execution.ts
**Status:** Pending

- [ ] Read `loadAgentDef` in `task-runner.ts` — understand signature and behavior
- [ ] Export equivalent from `execution.ts` near `loadBaseAgentPrompt`
- [ ] Signature: `(cwd: string, name: string) => { systemPrompt: string; tools: string; model: string } | null`

---

### Step 4: Update all test imports
**Status:** Pending

- [ ] `context-pressure-cache.test.ts` → import sidecar utils from `../taskplane/sidecar-telemetry`
- [ ] `context-window-autodetect.test.ts` → import `resolveContextWindow`, `FALLBACK_CONTEXT_WINDOW` from `../taskplane/context-window`; update all `resolveContextWindow(config, ctx)` call sites to `resolveContextWindow(config.context.worker_context_window, ctx)`; keep `loadConfig as taskRunnerLoadConfig` from `task-runner.ts`
- [ ] `context-window-resolution.test.ts` → import `resolveContextWindow`, `FALLBACK_CONTEXT_WINDOW` from `../taskplane/context-window`; update all call sites; keep `loadConfig` from `task-runner.ts`
- [ ] `sidecar-tailing.test.ts` → import from `../taskplane/sidecar-telemetry`
- [ ] `project-config-loader.test.ts` → change `_loadAgentDef` to `loadAgentDef` from `../taskplane/execution`; keep `_resetPointerWarning` from `task-runner.ts` (tests 6.4-6.6 test task-runner.ts state which stays in TP-162); keep `loadConfig as taskRunnerLoadConfig` from `task-runner.ts`
- [ ] `task-runner-review-skip.test.ts` → `isLowRiskStep` from `../taskplane/task-executor-core`
- [ ] Source-reading legacy tests: intentionally left unchanged in TP-161 (task-runner.ts not deleted until TP-162)

---

### Step 5: Testing & Verification
**Status:** Pending

- [ ] Full test suite passing (3255 tests, 0 failures)
- [ ] Same pass rate as Step 0 baseline (3255 pass in both)
- [ ] Fix all failures (none needed)

---

### Step 6: Documentation & Delivery
**Status:** Pending

- [ ] JSDoc headers on both new files (sidecar-telemetry.ts, context-window.ts)
- [ ] Discoveries logged (full inventory in Discoveries table)

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|
| **Direct import files**: `context-pressure-cache.test.ts` (`_tailSidecarJsonl`, `_createSidecarTailState`, type imports), `context-window-autodetect.test.ts` (`_resolveContextWindow`, `_FALLBACK_CONTEXT_WINDOW`, `loadConfig`), `context-window-resolution.test.ts` (`_resolveContextWindow`, `_FALLBACK_CONTEXT_WINDOW`, `loadConfig`), `project-config-loader.test.ts` (line 48: `loadConfig`; line 1514: `_loadAgentDef`, `_resetPointerWarning`), `sidecar-tailing.test.ts` (sidecar utils), `task-runner-review-skip.test.ts` (`isLowRiskStep`) | Must update in Step 4 | `extensions/tests/` |
| **Source-reading tests** (read task-runner.ts as text via readFileSync/path constants): `crash-recovery-spawn-reliability`, `mailbox`, `persistent-reviewer-context`, `persistent-worker-context`, `runtime-model-fallback`, `task-runner-duplicate-log`, `task-runner-exit-diagnostic`, `task-runner-orchestration`, `task-runner-rpc`, `task-runner-rpc-integration`, `task-runner-step-status` | All test **dead behavior** of legacy /task command; task-runner.ts NOT deleted in TP-161 so they still pass; leave untouched | `extensions/tests/` |
| **`isLowRiskStep`** already in `task-executor-core.ts` at line 352 | `task-runner-review-skip.test.ts` just needs import update | `extensions/taskplane/task-executor-core.ts:352` |
| **`getSidecarDir()`** has NO parameters in task-runner.ts (PROMPT signature was idealized future API from spec); verbatim extraction means no-param version | Export no-param `getSidecarDir()` from sidecar-telemetry.ts | `extensions/task-runner.ts:390` |
| **`createSidecarTailState()`** has NO parameters in task-runner.ts; `tailSidecarJsonl(filePath, tailState)` has 2 params | Verbatim extraction | `extensions/task-runner.ts:1121,1168` |
| **`resolveContextWindow`** currently takes `(config: TaskConfig, ctx: ExtensionContext)` - test calls use `resolveContextWindow(config, ctx)` | New module uses adapted signature `(configuredWindow: number \| undefined, ctx: ExtensionContext \| null)`; test call sites must be updated to `resolveContextWindow(config.context.worker_context_window, ctx)` | `extensions/task-runner.ts:362` |
| **`_resetPointerWarning`** resets module-level `_pointerWarningLogged` flag in task-runner.ts; tests use it between test cases | Need to export `resetPointerWarning()` from `execution.ts` alongside `loadAgentDef` | `extensions/task-runner.ts:268` |
| **`loadConfig` in context tests**: `context-window-autodetect.test.ts` and `context-window-resolution.test.ts` both import `loadConfig` from task-runner.ts for their sections 2+3 | Keep `loadConfig` import from `task-runner.ts` in those test files for now (task-runner.ts not deleted in TP-161) | `extensions/tests/` |
| **Test baseline**: 3255 tests, 0 failures | Baseline established | `npm run test:fast` output |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-11 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-11 05:52 | Task started | Runtime V2 lane-runner execution |
| 2026-04-11 05:52 | Step 0 started | Preflight — full reference inventory (BLOCKING) |
| 2026-04-11 06:09 | Worker iter 1 | done in 1033s, tools: 122 |
| 2026-04-11 06:09 | Task complete | .DONE created |

---

## Blockers

*None*
| 2026-04-11 05:59 | Review R001 | plan Step 1: APPROVE |
| 2026-04-11 06:03 | Review R002 | plan Step 4: REVISE |
| 2026-04-11 06:04 | Review R003 | plan Step 4: APPROVE |
| 2026-04-11 06:07 | Review R004 | code Step 4: APPROVE |
