# TP-138: Agent Thinking UX, Init Model Picker, and Global Defaults — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-04
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight
**Status:** ⬜ Not Started
- [ ] Read PROMPT.md and STATUS.md
- [ ] Read settings-tui.ts pickModel (v0.24.17)
- [ ] Read config-schema.ts defaults
- [ ] Read config-loader.ts preferences
- [ ] Read bin/taskplane.mjs init flow

### Step 1: Fix defaults to inherit
**Status:** ⬜ Not Started
- [ ] Worker thinking "off" → "" (inherit)
- [ ] Reviewer model hardcode → "" (inherit)
- [ ] Support "inherit" string alias
- [ ] Update templates
- [ ] Verify runtime inheritance

### Step 2: Thinking picker in /taskplane-settings
**Status:** ⬜ Not Started
- [ ] Add thinking-mode picker
- [ ] Query model thinking capability
- [ ] Auto-set thinking on model change
- [ ] Show available thinking levels
- [ ] Handle non-thinking models
- [ ] Allow override

### Step 3: Interactive model selection in init
**Status:** ⬜ Not Started
- [ ] Query model registry from CLI
- [ ] Provider → model picker in init
- [ ] Per-agent-type selection
- [ ] "Inherit" as default
- [ ] Fallback if unavailable
- [ ] Thinking prompt after model

### Step 4: Global defaults
**Status:** ⬜ Not Started
- [ ] Extend preferences schema
- [ ] Pre-populate from defaults during init
- [ ] Add --save-as-defaults command
- [ ] Detect global vs local install
- [ ] Show save confirmation

### Step 5: Testing & Verification
**Status:** ⬜ Not Started
- [ ] Test fresh init no defaults
- [ ] Test init with global defaults
- [ ] Test save-as-defaults
- [ ] Test "inherit" alias
- [ ] Test thinking auto-set
- [ ] Run full suite, fix failures

### Step 6: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update config docs
- [ ] Update README
- [ ] Update STATUS.md

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
