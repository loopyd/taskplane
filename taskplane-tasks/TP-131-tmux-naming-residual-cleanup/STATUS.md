# TP-131: TMUX Naming Residual Cleanup — Status

**Current Step:** Step 2: Dashboard server cleanup
**Status:** 🟡 In Progress
**Last Updated:** 2026-04-03
**Review Level:** 1
**Review Counter:** 2
**Iteration:** 1
**Size:** S

---

### Step 0: Preflight
**Status:** ✅ Complete
- [x] Read PROMPT.md and STATUS.md
- [x] Run audit script and log baseline
- [x] Grep inventory across scope files

### Step 1: Dashboard frontend cleanup
**Status:** ✅ Complete
- [x] Rename tmuxSessions → sessions in app.js
- [x] Rename tmuxSet → sessionSet or remove
- [x] Update liveness logic comments
- [x] Rename .tmux-* CSS classes in style.css
- [x] Update class references in app.js and index.html

### Step 2: Dashboard server cleanup
**Status:** 🟨 In Progress
- [ ] Rename tmuxSessions → sessions in API response
- [ ] Add /api/state compatibility transition (emit sessions + legacy tmuxSessions)
- [ ] Remove/rename getTmuxSessions stub
- [ ] Remove/rename /api/pane/* no-op endpoint
- [ ] Document tmuxSessionName compat mapping
- [ ] Update tmux prefix comments

### Step 3: Templates and other shipped files
**Status:** ⬜ Not Started
- [ ] Clean templates/config/task-runner.yaml
- [ ] Clean bin/rpc-wrapper.mjs comments
- [ ] Update task-orchestrator.ts comment

### Step 4: Audit script expansion
**Status:** ⬜ Not Started
- [ ] Add skills/ to SCAN_ROOTS
- [ ] Update guard test if needed

### Step 5: Verification
**Status:** ⬜ Not Started
- [ ] Run full test suite
- [ ] Fix failures
- [ ] Run audit and log final counts
- [ ] Verify dashboard renders correctly

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-04-03 15:39 | Task started | Runtime V2 lane-runner execution |
| 2026-04-03 15:39 | Step 0 started | Preflight |
| 2026-04-03 15:41 | Review R001 | plan Step 1: APPROVE |
| 2026-04-03 15:42 | Baseline tmux audit | 358 references total; 0 functional usage; roots: extensions/bin/templates/dashboard |
| 2026-04-03 15:43 | Scope grep inventory | app.js 27, style.css 12, server.cjs 21, template 4, rpc-wrapper 3, task-orchestrator 1, audit script 19, guard test 3 |
| 2026-04-03 15:45 | Review R002 | plan Step 2: REVISE |
| 2026-04-03 15:50 | Step 1 implementation | Renamed app.js session variables/comments and .tmux-* CSS classes to neutral session-* naming |
| 2026-04-03 15:51 | Targeted test | tests/tmux-reference-guard.test.ts passed (2/2) |

## Notes

- Reviewer suggestion: capture grep evidence that `/api/pane/*` is unused before removing endpoint.
- Reviewer suggestion: keep neutral “session ID/prefix” terminology consistent in updated comments.
