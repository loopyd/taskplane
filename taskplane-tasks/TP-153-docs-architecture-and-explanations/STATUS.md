# TP-153: Update architecture and explanation docs — Status

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

- [ ] Read all files in `docs/explanation/` and catalog every `/task` or stale reference
- [ ] Read root `README.md` "How It Works" section for ground truth

---

### Step 1: Update docs/explanation/architecture.md
**Status:** Pending

- [ ] Update ASCII diagram to remove `/task /task-status`
- [ ] Rewrite "Task Runner extension" module description as internal orchestrator module
- [ ] Update "Task Orchestrator extension" as sole user-facing surface
- [ ] Update "Data and control flow" section
- [ ] Remove any remaining `/task` or tmux references

---

### Step 2: Scan and fix other explanation docs
**Status:** Pending

- [ ] `execution-model.md` — scan and fix `/task` references (none found, clean)
- [ ] `review-loop.md` — scan and fix `/task` references (fixed standalone /task mention)
- [ ] `waves-lanes-and-worktrees.md` — scan and fix `/task` references (none found, clean)
- [ ] `persistence-and-resume.md` — scan and fix `/task` references (none found, clean)
- [ ] `package-and-template-model.md` — scan and fix `/task` references (none found, only file path references)

---

### Step 3: Documentation & Delivery
**Status:** Pending

- [ ] Verify all internal doc links resolve correctly
- [ ] Discoveries logged

---

## Reviews

| # | Type | Step | Verdict | File |
|---|------|------|---------|------|

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|
| `package-and-template-model.md` still lists `.pi/task-runner.yaml` and `.pi/task-orchestrator.yaml` as scaffolded files; canonical config is now `taskplane-config.json` | Tech debt — separate task to update scaffolding docs | `docs/explanation/package-and-template-model.md` lines 44-45 |
| `README.md` "How It Works" diagram shows `/task` labels inside lane boxes | Out of scope — separate task | `README.md` line 179 |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-07 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-07 18:55 | Task started | Runtime V2 lane-runner execution |
| 2026-04-07 18:55 | Step 0 started | Preflight |
| 2026-04-07 19:00 | Worker iter 1 | done in 264s, tools: 66 |
| 2026-04-07 19:00 | Task complete | .DONE created |

---

## Blockers

*None*

---

## Notes

*Reserved for execution notes*
