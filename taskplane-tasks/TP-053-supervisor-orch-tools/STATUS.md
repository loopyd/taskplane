# TP-053: Expose Orchestrator Commands as Tools for Supervisor Agent — Status

**Current Step:** None
**Status:** Pending
**Last Updated:** 2026-03-24
**Review Level:** 2
**Review Counter:** 0
**Iteration:** 2
**Size:** M

---

### Step 0: Preflight
**Status:** Pending

- [ ] Read each command handler (resume, integrate, pause, abort, status)
- [ ] Read review_step tool registration as pattern reference
- [ ] Understand pi registerTool() API
- [ ] Identify execCtx dependencies per command

---

### Step 1: Register orchestrator tools
**Status:** Pending

- [ ] Add `Type` import from `@mariozechner/pi-ai` to extension.ts
- [ ] Extract `doOrchStatus` helper (shared by command + tool)
- [ ] Extract `doOrchPause` helper (shared by command + tool)
- [ ] Extract `doOrchResume` helper (shared by command + tool) — returns status message, calls startBatchAsync internally
- [ ] Extract `doOrchAbort` helper (shared by command + tool) — works without execCtx
- [ ] Extract `doOrchIntegrate` helper (shared by command + tool) — wraps parseIntegrateArgs + resolveIntegrationContext + executeIntegration
- [ ] Refactor existing command handlers to call the extracted helpers
- [ ] Register all 5 tools with Type.Object parameters, description, promptSnippet, promptGuidelines
- [ ] Verify all tools return `{content: [{type: "text", text}], details: undefined}` and catch errors

---

### Step 2: Update supervisor prompt with tool awareness
**Status:** Pending

- [ ] Add Available Orchestrator Tools section to supervisor monitoring prompt
- [ ] Include tool names, parameters, and usage guidance
- [ ] Add proactive usage examples

---

### Step 3: Testing & Verification
**Status:** Pending

- [ ] All existing tests pass
- [ ] Tests for each tool registration (5 tools)
- [ ] Tests for tool parameter schemas
- [ ] Tests for supervisor prompt mentions tools

---

### Step 4: Documentation & Delivery
**Status:** Pending

- [ ] Check affected docs
- [ ] Discoveries logged
- [ ] `.DONE` created

---

## Reviews

| # | Type | Step | Verdict | File |
| R001 | plan | Step 1 | REVISE | .reviews/R001-plan-step1.md |
| R002 | code | Step 1 | REVISE | .reviews/R002-code-step1.md |
|---|------|------|---------|------|

---

## Discoveries

| Discovery | Disposition | Location |
|-----------|-------------|----------|
| Prior iteration created helpers + tool registrations, but duplicated both | Fixed — removed duplicates in iteration 2 | extension.ts |
| Tools also added to routing prompt since supervisor transitions between modes | Included in Step 2 | supervisor.ts |

---

## Execution Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-03-24 | Task staged | PROMPT.md and STATUS.md created |
| 2026-03-24 15:00 | Task started | Extension-driven execution |
| 2026-03-24 15:00 | Step 0 started | Preflight |
| 2026-03-24 15:00 | Step 1 started | Register orchestrator tools |
| 2026-03-24 15:00 | Step 2 started | Update supervisor primer/prompt with tool awareness |
| 2026-03-24 15:00 | Step 3 started | Testing & Verification |
| 2026-03-24 15:00 | Step 4 started | Documentation & Delivery |
| 2026-03-24 15:00 | Task started | Extension-driven execution |
| 2026-03-24 15:00 | Step 0 started | Preflight |
| 2026-03-24 15:00 | Step 1 started | Register orchestrator tools |
| 2026-03-24 15:00 | Step 2 started | Update supervisor primer/prompt with tool awareness |
| 2026-03-24 15:00 | Step 3 started | Testing & Verification |
| 2026-03-24 15:00 | Step 4 started | Documentation & Delivery |
| 2026-03-24 15:07 | Review R001 | plan Step 1: REVISE |
| 2026-03-24 15:26 | Review R002 | code Step 1: REVISE |

---

## Blockers

*None*

---

## Notes

*Reserved for execution notes*
