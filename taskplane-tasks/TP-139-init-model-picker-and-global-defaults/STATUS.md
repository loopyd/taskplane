# TP-139: Init Model Picker and Global Defaults — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-05
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight
**Status:** ⬜ Not Started
- [ ] Read PROMPT.md and STATUS.md
- [ ] Read bin/taskplane.mjs init flow
- [ ] Read config-loader.ts preferences functions
- [ ] Read config-schema.ts UserPreferences
- [ ] Understand settings-tui.ts pickModel pattern
- [ ] Determine model registry CLI access approach

### Step 1: Model registry access from CLI
**Status:** ⬜ Not Started
> ⚠️ Hydrate: Approach depends on Step 0 investigation of pi's model registry API

- [ ] Implement model query with graceful fallback
- [ ] Return structured model list

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

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-05 | Task staged | Split from TP-138, PROMPT.md and STATUS.md created |

---

## Blockers

- **TP-138** must complete first (inherit defaults and thinking picker)

---

## Notes

*Reserved for execution notes*
