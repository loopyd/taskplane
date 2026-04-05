# TP-141: First-Install Bootstrap and Cross-Provider Guidance — Status

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
- [ ] Verify TP-140 complete
- [ ] Read init flow and model discovery
- [ ] Read thinking picker
- [ ] Check pi --list-models format

### Step 1: First-install detection and global prefs bootstrap
**Status:** ⬜ Not Started
- [ ] Detect missing prefs file → bootstrap from schema defaults
- [ ] Default thinking to "high" for all agents
- [ ] Return bootstrap flag for downstream guidance
- [ ] Atomic write (temp + rename)
- [ ] Handle empty/corrupt prefs
- [ ] Run targeted tests

### Step 2: Cross-provider model guidance in first init
**Status:** ⬜ Not Started
- [ ] Detect first-init condition
- [ ] Query models, count providers
- [ ] 2+ providers: show guidance + cross-provider picker
- [ ] 1 provider: skip with info message
- [ ] Save to global prefs
- [ ] Skip on subsequent inits
- [ ] Run targeted tests

### Step 3: Thinking level picker enhancement
**Status:** ⬜ Not Started
- [ ] Settings TUI: all pi levels (off→xhigh) + inherit
- [ ] CLI init: same levels
- [ ] Default selection: high
- [ ] Thinking column from pi --list-models
- [ ] Run targeted tests

### Step 4: Testing & Verification
**Status:** ⬜ Not Started
- [ ] Full test suite passing
- [ ] Bootstrap creates prefs with thinking: high
- [ ] No re-bootstrap on existing prefs
- [ ] Cross-provider guidance triggers correctly
- [ ] Thinking picker shows all levels
- [ ] Single-provider skips guidance
- [ ] CLI smoke tests
- [ ] All failures fixed

### Step 5: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update config docs
- [ ] Update README if needed
- [ ] Document bootstrap behavior
- [ ] Update STATUS.md

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
| 2026-04-05 | Task staged | PROMPT.md and STATUS.md created |

---

## Blockers

- **TP-140** must complete first (global preferences architecture)

---

## Notes

*Reserved for execution notes*
