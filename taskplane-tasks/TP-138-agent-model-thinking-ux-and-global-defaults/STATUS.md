# TP-138: Agent Inherit Defaults and Thinking Picker — Status

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
- [ ] Read config-schema.ts defaults
- [ ] Read settings-tui.ts thinking fields
- [ ] Read lane-runner.ts and agent-host.ts thinking handling
- [ ] Read task-runner.ts fallback patterns
- [ ] Grep for thinking fallbacks across codebase

### Step 1: Fix defaults to inherit
**Status:** ⬜ Not Started
- [ ] Worker thinking "off" → "" (inherit)
- [ ] Reviewer model hardcode → "" (inherit)
- [ ] Normalize "inherit" to "" in config-loader
- [ ] Update templates
- [ ] Verify existing configs unaffected

### Step 2: Audit and fix runtime fallbacks
**Status:** ⬜ Not Started
- [ ] Check lane-runner.ts thinking fallback
- [ ] Check agent-host.ts flag passing
- [ ] Check task-runner.ts /task path
- [ ] Check merge.ts (verify v0.24.18 wiring)
- [ ] Verify empty thinking = session inheritance

### Step 3: Thinking picker in /taskplane-settings
**Status:** ⬜ Not Started
- [ ] Change thinking fields to picker control
- [ ] Options: inherit/on/off
- [ ] Reuse selectScrollable
- [ ] Current value marked with ✓
- [ ] Save to correct destination

### Step 4: Testing & Verification
**Status:** ⬜ Not Started
- [ ] Test empty thinking = no flag
- [ ] Test "inherit" normalization
- [ ] Test thinking picker save/load
- [ ] Test reviewer model inheritance
- [ ] Run full test suite

### Step 5: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update config docs
- [ ] Update STATUS.md

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
