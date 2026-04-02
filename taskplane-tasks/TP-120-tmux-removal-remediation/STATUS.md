# TP-120: TMUX Removal Remediation — Status

**Current Step:** Step 0: Preflight — Inventory remaining TMUX code
**Status:** 🟡 In Progress
**Last Updated:** 2026-04-02
**Review Level:** 2
**Review Counter:** 2
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight — Inventory remaining TMUX code
**Status:** 🟨 In Progress
- [x] Read PROMPT.md and STATUS.md
- [x] Count remaining TMUX refs
- [x] Identify TMUX functions in execution.ts
- [x] Identify TMUX usage in merge.ts
- [x] Identify TMUX usage in abort.ts
- [x] Log inventory

### Step 1: Remove TMUX helper functions from execution.ts
**Status:** ⬜ Not Started
- [x] Remove tmuxHasSessionAsync()
- [x] Remove tmuxKillSessionAsync()
- [x] Remove captureTmuxPaneTailAsync()
- [x] Remove captureTmuxPaneTail()
- [x] Remove toTmuxPath()
- [x] Remove other TMUX-only helpers
- [x] Update imports — remove TMUX references
- [x] Remove fallback branches, keep V2-only paths
- [ ] R002: Seed/clear V2 liveness registry cache in MergeHealthMonitor.poll()
- [ ] R002: Update supervisor-merge-monitoring test expectations for V2 liveness path

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

## Step 0 Inventory (2026-04-02)

- TMUX reference count (`grep -rn "tmux" extensions/taskplane/*.ts | grep -v "test\|//" | wc -l`): **160**
- `extensions/taskplane/execution.ts` TMUX functions identified:
  - `runTmuxCommandAsync()` (private helper)
  - `tmuxHasSessionAsync()`
  - `tmuxKillSessionAsync()`
  - `captureTmuxPaneTailAsync()`
  - `toTmuxPath()`
  - `captureTmuxPaneTail()`
- `extensions/taskplane/merge.ts` TMUX usage identified:
  - Import of `tmuxHasSessionAsync` from `execution.ts`
  - `MergeHealthMonitor.poll()` liveness check uses `tmuxHasSessionAsync(sessionName)`
  - Merge pane capture helpers (`captureMergePaneOutput`, `captureMergePaneOutputAsync`, `runMergeTmuxCommandAsync`) invoke `tmux capture-pane`
  - Session naming still references `config.orchestrator.tmux_prefix`
- `extensions/taskplane/abort.ts` TMUX usage identified:
  - `execSync('tmux list-sessions -F "#{session_name}"')` in abort flow Step 3 for session discovery

## Notes

- Reviewer suggestion (R002): add focused unit coverage for merge-monitor behavior when liveness cache is missing/populated.
- Reviewer suggestion (R002): clean up residual TMUX wording in execution comments in a follow-up.

## Execution Log

| Timestamp | Action | Outcome |
| 2026-04-02 13:48 | Task started | Runtime V2 lane-runner execution |
| 2026-04-02 13:48 | Step 0 started | Preflight — Inventory remaining TMUX code |
|-----------|--------|---------|
| 2026-04-02 13:51 | Review R001 | plan Step 1: APPROVE |
| 2026-04-02 14:01 | Review R002 | code Step 1: REVISE |
