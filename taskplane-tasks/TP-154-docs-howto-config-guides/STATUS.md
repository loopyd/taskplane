# TP-154: Update how-to config guides for current architecture — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-04-07
**Review Level:** 0
**Review Counter:** 0
**Iteration:** 1
**Size:** M

---

### Step 0: Preflight
**Status:** Pending

- [ ] Read both how-to files and catalog all stale references
- [ ] Read `.pi/taskplane-config.json` for the actual JSON config structure (file not in worktree; used config-schema.ts mapping instead)
- [ ] Read `docs/reference/configuration/taskplane-settings.md` for current field names

---

### Step 1: Update docs/how-to/configure-task-runner.md
**Status:** Pending

- [ ] Update title to reflect JSON config
- [ ] Update "Where this file lives" section for `taskplane-config.json`
- [ ] Convert all config examples from YAML to JSON with camelCase keys
- [ ] Remove all `/task` references
- [ ] Remove `spawn_mode` from worker section if present
- [ ] Update "Related guides" links

---

### Step 2: Update docs/how-to/configure-task-orchestrator.md
**Status:** Pending

- [ ] Update title for JSON config
- [ ] Update "Where this file lives" section for `taskplane-config.json`
- [ ] Convert all config examples from YAML to JSON with camelCase keys
- [ ] Remove tmux references (`spawn_mode: "tmux"`, `tmux_prefix`)
- [ ] Update "Related guides" links

---

### Step 3: Documentation & Delivery
**Status:** Pending

- [ ] Verify all internal doc links resolve correctly
- [ ] Discoveries logged (no discoveries — straightforward rewrite)

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
| 2026-04-07 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-07 18:55 | Task started | Runtime V2 lane-runner execution |
| 2026-04-07 18:55 | Step 0 started | Preflight |
| 2026-04-07 18:59 | Worker iter 1 | done in 222s, tools: 44 |
| 2026-04-07 18:59 | Task complete | .DONE created |

---

## Blockers

*None*

---

## Notes

*Reserved for execution notes*
