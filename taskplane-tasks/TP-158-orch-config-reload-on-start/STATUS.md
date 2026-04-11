# TP-158: Re-read config on /orch start to fix stale task_areas (#460) — Status

**Current Step:** Not Started
**Status:** 🔵 Ready for Execution
**Last Updated:** 2026-04-10
**Review Level:** 1
**Review Counter:** 0
**Iteration:** 0
**Size:** S

---

### Step 0: Preflight
**Status:** ⬜ Not Started

- [ ] Read `doOrchStart()` in `extension.ts`
- [ ] Read the `/taskplane-settings` `onConfigChanged` callback
- [ ] Read the `session_start` handler
- [ ] Verify test baseline

---

### Step 1: Add config reload at the top of doOrchStart()
**Status:** ⬜ Not Started

- [ ] Implement reload block before the execCtx guard
- [ ] Phase guard: skip reload during active batch
- [ ] Verify atomic assignment pattern matches settings reload

---

### Step 2: Testing & Verification
**Status:** ⬜ Not Started

- [ ] Full test suite passing
- [ ] CLI smoke passing
- [ ] Fix all failures

---

### Step 3: Documentation & Delivery
**Status:** ⬜ Not Started

- [ ] Inline comment explaining the reload
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
