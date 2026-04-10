# TP-157: Consolidate npm/package path resolution into path-resolver.ts — Status

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

- [ ] Read all three source files and catalog every path resolution function
- [ ] Verify test suite baseline

---

### Step 1: Create extensions/taskplane/path-resolver.ts
**Status:** ⬜ Not Started

- [ ] Implement `getNpmGlobalRoot()` — cached, ESM-safe, shell:true for Windows
- [ ] Implement `resolvePiCliPath()` — dynamic-first, all platforms, clear error
- [ ] Implement `resolveTaskplanePackageFile()` — dynamic-first, local dev fallback
- [ ] Implement `resolveTaskplaneAgentTemplate()` — convenience wrapper
- [ ] Add JSDoc with platform notes to all exports

---

### Step 2: Refactor callers to use path-resolver.ts
**Status:** ⬜ Not Started

- [ ] `execution.ts` — remove local functions, import from path-resolver.ts
- [ ] `agent-host.ts` — remove local functions, import from path-resolver.ts
- [ ] `agent-bridge-extension.ts` — remove local functions, import from path-resolver.ts
- [ ] Verify no other files import removed functions directly

---

### Step 3: Testing & Verification
**Status:** ⬜ Not Started

- [ ] Full test suite passing
- [ ] CLI smoke checks passing
- [ ] Fix all failures

---

### Step 4: Documentation & Delivery
**Status:** ⬜ Not Started

- [ ] JSDoc file header on path-resolver.ts
- [ ] Check AGENTS.md and development-setup.md for affected references
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

---

## Notes

*Reserved for execution notes*
