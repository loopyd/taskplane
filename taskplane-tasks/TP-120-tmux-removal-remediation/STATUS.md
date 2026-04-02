# TP-120: TMUX Removal Remediation — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-02
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight — Inventory remaining TMUX code
**Status:** ⬜ Not Started
- [ ] Read PROMPT.md and STATUS.md
- [ ] Count remaining TMUX refs
- [ ] Identify TMUX functions in execution.ts
- [ ] Identify TMUX usage in merge.ts
- [ ] Identify TMUX usage in abort.ts
- [ ] Log inventory

### Step 1: Remove TMUX helper functions from execution.ts
**Status:** ⬜ Not Started
- [ ] Remove tmuxHasSessionAsync()
- [ ] Remove tmuxKillSessionAsync()
- [ ] Remove captureTmuxPaneTailAsync()
- [ ] Remove captureTmuxPaneTail()
- [ ] Remove toTmuxPath()
- [ ] Remove other TMUX-only helpers
- [ ] Update imports — remove TMUX references
- [ ] Remove fallback branches, keep V2-only paths

### Step 2: Remove merge health monitor TMUX polling
**Status:** ⬜ Not Started
- [ ] Replace or remove tmuxHasSessionAsync in MergeHealthMonitor.poll()
- [ ] Remove captureTmuxPaneTail* calls
- [ ] Remove tmuxHasSessionAsync import from merge.ts
- [ ] Evaluate if entire health monitor is legacy dead code

### Step 3: Remove abort.ts TMUX code
**Status:** ⬜ Not Started
- [ ] Remove execSync('tmux list-sessions') from abort.ts
- [ ] Replace with V2 registry or remove
- [ ] Ensure V2 abort is only path

### Step 4: Config rename — tmux_prefix → sessionPrefix
**Status:** ⬜ Not Started
- [ ] Rename in config-schema.ts
- [ ] Update config-loader.ts (keep backward-compat alias)
- [ ] Rename generateLaneSessionId parameter
- [ ] Update all call sites
- [ ] Update settings-tui.ts
- [ ] Update template YAML
- [ ] Update dashboard

### Step 5: Tests
**Status:** ⬜ Not Started
- [ ] Update test references
- [ ] Run full suite
- [ ] Fix all failures
- [ ] Verify zero functional TMUX code

### Step 6: Documentation & Delivery
**Status:** ⬜ Not Started
- [ ] Update STATUS.md
- [ ] Final TMUX reference count
- [ ] Log before/after count

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
