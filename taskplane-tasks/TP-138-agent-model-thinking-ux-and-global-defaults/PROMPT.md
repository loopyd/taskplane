# Task: TP-138 - Agent Thinking UX, Init Model Picker, and Global Defaults

**Created:** 2026-04-04
**Size:** M

## Review Level: 2 (Plan + Code)

**Assessment:** Touches init flow, config schema, and user preferences. Focused scope after model picker was shipped separately in v0.24.17.
**Score:** 4/8 — Blast radius: 2 (init, config schema, preferences), Pattern novelty: 1, Security: 0, Reversibility: 1

## Canonical Task Folder

```
taskplane-tasks/TP-138-agent-model-thinking-ux-and-global-defaults/
├── PROMPT.md
├── STATUS.md
├── .reviews/
└── .DONE
```

## Mission

Complete the agent configuration UX overhaul. The interactive model picker in `/taskplane-settings` was shipped in v0.24.17 (Sage-style provider → model selection). This task covers the remaining items:

### Already done (v0.24.17)
- ✅ Interactive model picker in `/taskplane-settings` (two-level provider → model)
- ✅ "inherit (use current session model)" as first option
- ✅ Current model marked with ✓
- ✅ Falls back to manual input if no models available

### Remaining work

1. **Fix defaults to inherit** — worker thinking defaults to `"off"`, reviewer model hardcodes `openai/gpt-5.3-codex`. Both should default to `""` (inherit). Support explicit `"inherit"` string as alias.

2. **Thinking picker in /taskplane-settings** — add a thinking-mode picker (similar to model picker) for the thinking settings. When a model with thinking support is selected, auto-set thinking to `"on"`. Show available thinking levels for the selected model.

3. **Interactive model selection in `taskplane init`** — bring the same model picker UX to the init flow. Currently init doesn't offer model selection at all. This requires accessing pi's model registry from the CLI context (spawn pi subprocess or read models.json).

4. **Global defaults** — extend `~/.pi/agent/taskplane/preferences.json` with agent config defaults. Add `taskplane config --save-as-defaults` command. Pre-populate during `taskplane init` from global defaults. Detect global vs local install.

## Dependencies

- None

## Context to Read First

**Tier 2:**
- `taskplane-tasks/CONTEXT.md`

**Tier 3:**
- `extensions/taskplane/settings-tui.ts` — the model picker implementation (v0.24.17)
- `extensions/taskplane/config-schema.ts` — defaults for all agent configs
- `extensions/taskplane/config-loader.ts` — config loading chain, user preferences
- `bin/taskplane.mjs` — init flow, CLI commands

## File Scope

- `extensions/taskplane/settings-tui.ts`
- `extensions/taskplane/config-schema.ts`
- `extensions/taskplane/config-loader.ts`
- `bin/taskplane.mjs`
- `templates/config/task-runner.yaml`

## Steps

### Step 0: Preflight
- [ ] Read PROMPT.md and STATUS.md
- [ ] Read settings-tui.ts pickModel implementation (v0.24.17)
- [ ] Read config-schema.ts defaults for worker, reviewer, merger
- [ ] Read config-loader.ts user preferences loading chain
- [ ] Read bin/taskplane.mjs init flow

### Step 1: Fix defaults to inherit
- [ ] config-schema.ts: worker.thinking `"off"` → `""` (inherit)
- [ ] config-schema.ts: reviewer.model `"openai/gpt-5.3-codex"` → `""` (inherit)
- [ ] Support explicit `"inherit"` string as alias for `""` in config-loader (treat identically at runtime)
- [ ] Update template files (task-runner.yaml, any JSON templates)
- [ ] Verify: empty model/thinking = pi session's model/thinking used at runtime

### Step 2: Thinking picker in /taskplane-settings
- [ ] Add thinking-mode picker for worker, reviewer thinking settings
- [ ] Query model's thinking capability from registry metadata if possible
- [ ] When user changes a model to one with thinking support, auto-set thinking to `"on"`
- [ ] Show available thinking levels (off, on, or budget levels if model supports them)
- [ ] For models without thinking support, show thinking as disabled/off
- [ ] Allow user to override (never force thinking on)

### Step 3: Interactive model selection in taskplane init
- [ ] Query pi's model registry from CLI context (spawn pi subprocess or read models.json)
- [ ] Present the same provider → model picker during init for agent model configuration
- [ ] Allow per-agent-type model selection (worker, reviewer, merger)
- [ ] "inherit from session" as default/first option
- [ ] Fall back to skip/manual entry if model list unavailable
- [ ] After model selection, prompt for thinking mode

### Step 4: Global defaults infrastructure
- [ ] Extend preferences.json schema with agent config defaults section
- [ ] During `taskplane init`, check for global defaults and pre-populate config
- [ ] Add `taskplane config --save-as-defaults` command
- [ ] Detect global vs local install — suppress save-as-defaults for local installs
- [ ] Show user what was saved and where

### Step 5: Testing & Verification
- [ ] Test: fresh init with no global defaults → all inherit
- [ ] Test: fresh init with global defaults → pre-populated
- [ ] Test: save-as-defaults writes to correct preferences location
- [ ] Test: explicit "inherit" string treated same as empty string
- [ ] Test: thinking auto-set when model changes
- [ ] Run full suite, fix failures

### Step 6: Documentation & Delivery
- [ ] Update config reference docs
- [ ] Update README if init flow changed
- [ ] Update STATUS.md

## Design Notes

### "inherit" semantics
- `model: ""` or `model: "inherit"` → don't pass `--model` to pi, use session model
- `thinking: ""` or `thinking: "inherit"` → don't pass `--thinking` to pi, use session thinking
- Both treated identically at runtime; "inherit" is a human-readable alias

### Model registry access from CLI
`taskplane init` runs as a standalone Node script, not inside pi. Options:
1. Spawn `pi --mode json` to query model list via RPC
2. Read `~/.pi/models.json` directly (simpler but may not reflect auth state)
3. Import pi's ModelRegistry if available as a library

Prefer option 1 (RPC query) for accuracy — it checks auth state.

## Do NOT

- Hardcode any specific model names as defaults
- Break existing configs (empty string must still work as inherit)
- Remove per-agent model override capability
- Make thinking mandatory for models that support it (user can always set to off)
- Reimplement the model picker (already done in settings-tui.ts — reuse it)

## Git Commit Convention

- `feat(TP-138): complete Step N — ...`
