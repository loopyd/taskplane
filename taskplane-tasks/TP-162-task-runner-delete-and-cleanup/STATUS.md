# TP-162: Delete task-runner.ts and clean up all references — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-11
**Review Level:** 1
**Review Counter:** 0
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight
**Status:** Pending

- [ ] Confirm TP-161 complete (new modules exist, tests pass)
- [ ] Grep all remaining task-runner references across project
- [ ] Categorize each reference
- [ ] Run test baseline (3255/3255 pass)

---

### Step 1: Remove from package.json
**Status:** Pending

- [ ] Remove from `pi.extensions` array
- [ ] Remove from `files` array
- [ ] Validate JSON: `node -e "require('./package.json')"`

---

### Step 2: Remove dead code from execution.ts
**Status:** Pending

- [ ] Delete `resolveTaskRunnerExtensionPath()`
- [ ] Clean TASK_AUTOSTART legacy comments

---

### Step 3: Delete task-runner.ts
**Status:** Pending

- [ ] Export `loadConfig` and `_resetPointerWarning` from config-loader.ts (move pointer logic there)
- [ ] Update imports in 3 test files: context-window-autodetect, context-window-resolution, project-config-loader
- [ ] Delete 9 source-extraction test files that entirely test task-runner.ts internals
- [ ] Remove TP-090 describe block from mailbox.test.ts
- [ ] Remove "task-runner.ts TASKPLANE_MODEL_FALLBACK" describe block from runtime-model-fallback.test.ts
- [ ] Final check: no remaining imports or source-reading refs
- [ ] **Delete `extensions/task-runner.ts`**

---

### Step 4: Update docs and templates
**Status:** Pending

- [ ] `extensions/task-orchestrator.ts` — remove dual-load comment
- [ ] `docs/maintainers/development-setup.md` — remove task-runner load instructions
- [ ] `docs/maintainers/package-layout.md` — remove task-runner.ts from layout
- [ ] `docs/explanation/architecture.md` — remove task-runner.ts module description
- [ ] `AGENTS.md` (root) — update project map and dev commands
- [ ] `CONTRIBUTING.md` — update load commands and package structure
- [ ] `extensions/tsconfig.json` — remove task-runner.ts from include array
- [ ] `docs/tutorials/install-from-source.md` — remove task-runner-only run option
- [ ] `templates/agents/task-worker.md` — update lines 363-365 (task-runner.ts examples → use task-executor-core.ts or engine.ts)
- [ ] `bin/taskplane.mjs` — audit (no changes needed based on grep)
- [ ] `extensions/taskplane/path-resolver.ts` — update example path in JSDoc from task-runner.ts to task-orchestrator.ts
- [ ] `extensions/taskplane/config-loader.ts` shim comment — remove "deleted in TP-162" phrasing (write as if it never existed)
- [ ] Final residual reference sweep across maintained files (excluding historical: CHANGELOG.md, docs/specifications/)

---

### Step 5: Testing & Verification
**Status:** Pending

- [ ] Full test suite passing (3195/3195, zero failures)
- [ ] CLI smoke checks passing (`help`, `version`, `init --dry-run`, `doctor`)
- [ ] Fix all failures (no failures)

---

### Step 6: Version bump and delivery
**Status:** Pending

- [ ] Bump `package.json` version to `0.26.0` (and package-lock.json)
- [ ] Discoveries logged

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|
| TP-161 did NOT update all test imports — 3 test files still import `loadConfig`/`_resetPointerWarning` from task-runner.ts | Fix in Step 3: export these from config-loader.ts and update test imports | extensions/tests/ |
| 3 test files are source-extraction tests reading task-runner.ts directly (crash-recovery, persistent-reviewer, persistent-worker) | Delete these test files in Step 3 — their contracts covered by lane-runner-v2.test.ts | extensions/tests/ |
| mailbox.test.ts has TP-090 source-extraction block that reads task-runner.ts | Remove only the TP-090 describe block in Step 3 | extensions/tests/mailbox.test.ts |
| config-loader.ts doesn't currently import workspace.ts — adding loadConfig will require that import | No circular dep risk (workspace.ts imports only git.ts and types.ts) | extensions/taskplane/config-loader.ts |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|  
| 2026-04-11 | Steps 1-6 completed | task-runner.ts deleted, all references cleaned, v0.26.0, 3195/3195 tests pass |
| 2026-04-11 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-11 06:11 | Task started | Runtime V2 lane-runner execution |
| 2026-04-11 06:11 | Step 0 started | Preflight |
| 2026-04-11 06:48 | Worker iter 1 | done in 2221s, tools: 326 |
| 2026-04-11 06:48 | Task complete | .DONE created |

---

## Blockers

*None*
| 2026-04-11 06:21 | Review R001 | plan Step 1: APPROVE |
| 2026-04-11 06:22 | Review R002 | plan Step 2: APPROVE |
| 2026-04-11 06:25 | Review R003 | plan Step 3: REVISE |
| 2026-04-11 06:28 | Review R004 | plan Step 3: APPROVE |
| 2026-04-11 06:34 | Review R005 | plan Step 4: REVISE |
| 2026-04-11 06:37 | Review R006 | plan Step 4: REVISE |
| 2026-04-11 06:38 | Review R007 | plan Step 4: APPROVE |
