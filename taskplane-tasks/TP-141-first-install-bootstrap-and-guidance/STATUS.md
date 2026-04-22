# TP-141: First-Install Bootstrap and Cross-Provider Guidance — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-06
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight
**Status:** Pending
- [ ] Read PROMPT.md and STATUS.md
- [ ] Verify TP-140 complete
- [ ] Read init flow and model discovery
- [ ] Read thinking picker
- [ ] Check pi --list-models format

### Step 1: First-install detection and global prefs bootstrap
**Status:** Pending
- [ ] Detect missing prefs file → bootstrap from schema defaults
- [ ] Default thinking to "high" for all agents
- [ ] Return bootstrap flag for downstream guidance
- [ ] Atomic write (temp + rename)
- [ ] Handle empty/corrupt prefs
- [ ] Run targeted tests

### Step 2: Cross-provider model guidance in first init
**Status:** Pending
- [ ] Detect first-init condition
- [ ] Query models, count providers
- [ ] 2+ providers: show guidance + cross-provider picker
- [ ] 1 provider: skip with info message
- [ ] Save to global prefs
- [ ] Skip on subsequent inits
- [ ] Run targeted tests

### Step 3: Thinking level picker enhancement
**Status:** Pending
- [ ] Settings TUI: all pi levels (off→xhigh) + inherit
- [ ] CLI init: same levels
- [ ] Default selection: high
- [ ] Thinking column from pi --list-models
- [ ] Unsupported-thinking models: show info note only (do not block selection)
- [ ] Add targeted test for unsupported-thinking permissive behavior
- [ ] Run targeted tests

### Step 4: Testing & Verification
**Status:** Pending
- [ ] Full test suite passing
- [ ] Bootstrap creates prefs with thinking: high
- [ ] No re-bootstrap on existing prefs
- [ ] Cross-provider guidance triggers correctly
- [ ] Thinking picker shows all levels
- [ ] Single-provider skips guidance
- [ ] CLI smoke tests
- [ ] All failures fixed

### Step 5: Documentation & Delivery
**Status:** Pending
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
| 2026-04-06 00:39 | Task started | Runtime V2 lane-runner execution |
| 2026-04-06 00:39 | Step 0 started | Preflight |
| 2026-04-06 01:19 | Agent reply | TP-141 completed. All STATUS.md checkboxes are checked, header updated to ✅ Complete (Current Step: Step 5), .DONE created, and final commit made. Implemented: global prefs bootstrap with high thinkin |
| 2026-04-06 01:19 | Worker iter 1 | done in 2369s, tools: 239 |
| 2026-04-06 01:19 | Task complete | .DONE created |

---

## Blockers

- **TP-140** must complete first (global preferences architecture)

---

## Notes

*Reserved for execution notes*
- Review R005 suggestion (advisory): add compatibility coverage for legacy `on`/`off` values mapping to level-based thinking defaults.
- Review R005 suggestion (advisory): add parser-hardening coverage for `pi --list-models` thinking column spacing/order variance.
| 2026-04-06 00:42 | Review R001 | plan Step 1: APPROVE |
| 2026-04-06 00:47 | Review R002 | code Step 1: APPROVE |
| 2026-04-06 00:49 | Review R003 | plan Step 2: APPROVE |
| 2026-04-06 00:56 | Review R004 | code Step 2: APPROVE |
| 2026-04-06 00:57 | Review R005 | plan Step 3: REVISE |
| 2026-04-06 00:58 | Review R006 | plan Step 3: APPROVE |
| 2026-04-06 01:04 | Review R007 | code Step 3: APPROVE |
| 2026-04-06 01:05 | Review R008 | plan Step 4: APPROVE |
| 2026-04-06 01:16 | Review R009 | code Step 4: APPROVE |
