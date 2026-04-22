# TP-150: Update docs README and rewrite single-task tutorial — Status

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

- [ ] Read `docs/README.md` and identify all `/task` references and stale content
- [ ] Read `docs/tutorials/run-your-first-task.md` and understand current structure
- [ ] Read root `README.md` sections on single-task execution via `/orch` for ground truth

---

### Step 1: Update docs/README.md
**Status:** Pending

- [ ] Update "New Users" tutorial links — reframe "Run Your First Task" description
- [ ] Update "Operators" section — fix "Configure Task Runner" link text
- [ ] Remove all `/task` references throughout file
- [ ] Verify all links resolve to valid files

---

### Step 2: Rewrite docs/tutorials/run-your-first-task.md
**Status:** Pending

- [ ] Rewrite tutorial for `/orch`-based single task execution
- [ ] Show running `/orch <path/to/PROMPT.md>` workflow
- [ ] Explain PROMPT.md and STATUS.md
- [ ] Show monitoring via `/orch-status` and dashboard
- [ ] Show pause/resume via `/orch-pause` and `/orch-resume`
- [ ] Show completion verification
- [ ] Update troubleshooting and "Next Step" links

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
| Root README.md still has deprecated `/task` command entries in the commands table | Out of scope — another task handles root README cleanup | `README.md` |
| `docs/how-to/use-tmux-for-visibility.md` exists but may be stale with Runtime V2 subprocess backend | Out of scope — note for future cleanup | `docs/README.md` Operators section |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-07 | Task staged | PROMPT.md and STATUS.md created |
| 2026-04-07 18:55 | Task started | Runtime V2 lane-runner execution |
| 2026-04-07 18:55 | Step 0 started | Preflight |
| 2026-04-07 19:01 | Worker iter 1 | done in 326s, tools: 60 |
| 2026-04-07 19:01 | Task complete | .DONE created |

---

## Blockers

*None*

---

## Notes

*Reserved for execution notes*
