# TP-159: Detect and recover ghost workers after silent subprocess death (#461) — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-10
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 0
**Size:** M

---

### Step 0: Preflight
**Status:** ⬜ Not Started

- [ ] Read `monitorLanes()` in `execution.ts`
- [ ] Read `resolveTaskMonitorState()` — understand grace periods
- [ ] Read `detectOrphans()` and `markOrphansCrashed()` in `process-registry.ts`
- [ ] Verify test baseline

---

### Step 1: Wire orphan detection into the monitor poll loop
**Status:** ⬜ Not Started

- [ ] Add orphan detection block after liveness registry refresh
- [ ] Wrap in try/catch — monitor loop must never throw
- [ ] Refresh cache after marking orphans

---

### Step 2: Fast-fail on dead PID + stale snapshot
**Status:** ⬜ Not Started

- [ ] Read existing grace period logic carefully
- [ ] Implement fast-fail: stale > stallTimeout/2 AND agent confirmed dead
- [ ] Only applies after startup grace (trackerAgeMs >= 60s)

---

### Step 3: Verify supervisor/operator visibility
**Status:** ⬜ Not Started

- [ ] Confirm read_agent_status / list_active_agents reflect crashed status
- [ ] Trace failed task path through monitor loop to engine failure handling

---

### Step 4: Testing & Verification
**Status:** ⬜ Not Started

- [ ] Full test suite passing
- [ ] CLI smoke passing
- [ ] Fix all failures

---

### Step 5: Documentation & Delivery
**Status:** ⬜ Not Started

- [ ] Inline comments for new logic
- [ ] Discoveries logged

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
| 2026-04-10 | Task staged | PROMPT.md and STATUS.md created |

---

## Blockers

*None*
