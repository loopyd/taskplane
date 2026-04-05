# TP-139: Init Model Picker and Global Defaults — Status

**Current Step:** Step 1: Model registry access from CLI (revision R002)
**Status:** 🟡 In Progress
**Last Updated:** 2026-04-05
**Review Level:** 2
**Review Counter:** 2
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight
**Status:** ✅ Complete
- [x] Read PROMPT.md and STATUS.md
- [x] Read bin/taskplane.mjs init flow
- [x] Read config-loader.ts preferences functions
- [x] Read config-schema.ts UserPreferences
- [x] Understand settings-tui.ts pickModel pattern
- [x] Determine model registry CLI access approach

### Step 1: Model registry access from CLI
**Status:** 🟨 In Progress
> ⚠️ Hydrate: Approach depends on Step 0 investigation of pi's model registry API

- [x] Implement CLI model discovery helper using `pi --list-models`
- [x] Parse provider/model output into `{ provider, id, displayName }[]`
- [x] Handle missing `pi`/query failures with graceful fallback behavior
- [x] Add targeted tests for model discovery parsing + fallback
- [x] R002 fix: make CLI direct-execution guard symlink-safe and add regression test

### Step 2: Interactive model selection in init
**Status:** ⬜ Not Started
- [ ] Add provider → model picker to init flow
- [ ] "Inherit" as default first option
- [ ] Per-agent or "same for all" selection
- [ ] Thinking mode prompt after model
- [ ] Write to generated config
- [ ] Graceful fallback if unavailable

### Step 3: Global defaults infrastructure
**Status:** ⬜ Not Started
- [ ] Extend UserPreferences schema
- [ ] Pre-populate from defaults during init
- [ ] Add `taskplane config --save-as-defaults` command
- [ ] Detect global vs local install
- [ ] Show save confirmation

### Step 4: Testing & Verification
**Status:** ⬜ Not Started
- [ ] Full test suite passing
- [ ] Init with no defaults → inherit
- [ ] Init with defaults → pre-populated
- [ ] save-as-defaults writes correctly
- [ ] Graceful degradation without model list
- [ ] CLI smoke tests
- [ ] All failures fixed

### Step 5: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update commands.md
- [ ] Update README if needed
- [ ] Update STATUS.md
- [ ] Discoveries logged

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|
| 1 | Plan | 1 | APPROVE | - |
| 2 | Code | 1 | REVISE | .reviews/R002-code-step1.md |

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-05 | Task staged | Split from TP-138, PROMPT.md and STATUS.md created |
| 2026-04-05 18:55 | Task started | Runtime V2 lane-runner execution |
| 2026-04-05 18:55 | Step 0 started | Preflight |
| 2026-04-05 18:59 | Review R001 | plan Step 1: APPROVE |
| 2026-04-05 19:06 | Review R002 | code Step 1: REVISE |
| 2026-04-05 19:07 | Step 1 tests | `tests/init-model-discovery.test.ts` passed (4/4) |
| 2026-04-05 19:14 | R002 regression tests | `tests/cli-command-surface.test.ts` + `tests/init-model-discovery.test.ts` passed (7/7) |

---

## Blockers

- **TP-138** must complete first (inherit defaults and thinking picker)

---

## Notes

- Suggestion from R002 (advisory): tighten parser filtering for non-table lines if `pi --list-models` format changes.
