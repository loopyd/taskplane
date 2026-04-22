# TP-140: Global Preferences Architecture — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-05
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 2
**Size:** L

---

### Step 0: Preflight
**Status:** Pending
- [ ] Read PROMPT.md and STATUS.md
- [ ] Read config-loader.ts merge chain
- [ ] Read config-schema.ts UserPreferences and defaults
- [ ] Read settings-tui.ts source detection and save logic
- [ ] Map all UserPreferences references across codebase

### Step 1: Rename user preferences → global preferences
**Status:** Pending
- [ ] Rename UserPreferences → GlobalPreferences
- [ ] Rename load/resolve/apply functions
- [ ] Update all imports and references
- [ ] Update variable names, comments, JSDoc
- [ ] Run targeted tests

### Step 2: Expand global preferences schema
**Status:** Pending
- [ ] Expand GlobalPreferences to cover all configurable fields
- [ ] Add backward-compatible support for legacy flat-key global preferences files
- [ ] Preserve preferences-only fields (dashboardPort, initAgentDefaults) during schema expansion
- [ ] Update extractAllowlistedPreferences for expanded fields
- [ ] Update applyGlobalPreferences for all new fields
- [ ] Add targeted tests for legacy flat keys + expanded nested preference parsing
- [ ] Normalize nested legacy spawnMode values (tmux → subprocess) during global preference application
- [ ] Add regression tests for nested orchestrator/worker spawnMode migration and update stale migration comment

### Step 3: Flip config loading precedence
**Status:** Pending
- [ ] Rewrite loadProjectConfig: schema → global → project
- [ ] Implement deep merge for sparse project config
- [ ] Update loadLayer1Config similarly
- [ ] Update tests for new precedence

### Step 4: Settings TUI — source badges and save behavior
**Status:** Pending
- [ ] Source badges: (global) and (project) only
- [ ] Default save: global preferences
- [ ] Sparse write for project overrides
- [ ] "Remove project override" option
- [ ] Update field layers
- [ ] Treat destination-picker cancel/escape as skip (no write)
- [ ] Add tests for cancel semantics and resolveWriteAction remove-project route
- [ ] Preserve existing YAML project overrides when first project JSON override is written
- [ ] Add regression tests for YAML-only write/remove-project compatibility
- [ ] Seed first project JSON write from canonical loader YAML overrides (including supervisor/verification/qualityGate/modelFallback/workspace)
- [ ] Add regression tests for preserving non-source-detection YAML keys and workspace YAML on first write

### Step 5: Sparse project config in taskplane init
**Status:** Pending
- [ ] generateProjectConfig writes only project-specific fields
- [ ] Agent settings NOT included
- [ ] Persist only explicit init-time orchestrator overrides (non-default/user-chosen values)
- [ ] Existing full configs continue working
- [ ] Update init integration tests to sparse orchestrator contract and preserve legacy migration coverage

### Step 6: Testing & Verification
**Status:** Pending
- [ ] Full test suite passing
- [ ] Sparse config merge tests
- [ ] Precedence tests
- [ ] Settings TUI tests
- [ ] CLI smoke tests
- [ ] All failures fixed

### Step 7: Documentation & Delivery
**Status:** Pending
- [ ] Update config docs
- [ ] Update settings docs
- [ ] Rename "user preferences" in all docs
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
| 2026-04-05 22:05 | Task started | Runtime V2 lane-runner execution |
| 2026-04-05 22:05 | Step 0 started | Preflight |
| 2026-04-05 23:08 | Worker iter 1 | done in 3736s, tools: 329 |
| 2026-04-05 23:21 | Agent reply | TP-140 complete. Finished Step 6 testing/verification (full suite + targeted regressions + CLI smoke), finished Step 7 docs updates (config/settings/commands/architecture + terminology rename), marked |
| 2026-04-05 23:21 | Worker iter 2 | done in 820s, tools: 71 |
| 2026-04-05 23:21 | Task complete | .DONE created |

---

## Blockers

*None*

---

## Notes

- Suggestion (R003): consider modeling GlobalPreferences as config deep-partial + preferences-only extension to reduce schema drift.
- Suggestion (R003): keep allowlist extraction centralized so new config keys are not missed.
- Suggestion (R005): optionally harden nested override validation against schema/allowlist to prevent unsupported nested keys.
- Suggestion (R010): clean up stale test names that still mention legacy terms (default/user/project config wording).
- Suggestion (R011): consider broader test-name cleanup for legacy wording in settings-tui tests.
- Suggestion (R012): consider removing stale legacy wording in test names/comments during follow-up cleanup.
- Suggestion (R014): if init still asks for agent model/thinking values, message clearly that they are global-only and not project-persisted.
- Suggestion (R016): optional UX note in init flow clarifying that model/thinking selections are global preference defaults, not project JSON fields.
| 2026-04-05 22:07 | Review R001 | plan Step 1: APPROVE |
| 2026-04-05 22:11 | Review R002 | code Step 1: APPROVE |
| 2026-04-05 22:13 | Review R003 | plan Step 2: REVISE |
| 2026-04-05 22:13 | Review R004 | plan Step 2: APPROVE |
| 2026-04-05 22:19 | Review R005 | code Step 2: REVISE |
| 2026-04-05 22:22 | Review R006 | code Step 2: APPROVE |
| 2026-04-05 22:23 | Review R007 | plan Step 3: APPROVE |
| 2026-04-05 22:30 | Review R008 | code Step 3: APPROVE |
| 2026-04-05 22:31 | Review R009 | plan Step 4: APPROVE |
| 2026-04-05 22:40 | Review R010 | code Step 4: REVISE |
| 2026-04-05 22:44 | Review R011 | code Step 4: REVISE |
| 2026-04-05 22:48 | Review R012 | code Step 4: REVISE |
| 2026-04-05 22:51 | Review R013 | code Step 4: APPROVE |
| 2026-04-05 22:53 | Review R014 | plan Step 5: REVISE |
| 2026-04-05 22:54 | Review R015 | plan Step 5: APPROVE |
| 2026-04-05 23:00 | Review R016 | code Step 5: REVISE |
| 2026-04-05 23:04 | Review R017 | code Step 5: APPROVE |
| 2026-04-05 23:05 | Review R018 | plan Step 6: APPROVE |
| 2026-04-05 23:18 | Review R019 | code Step 6: APPROVE |
