# General — Context

**Last Updated:** 2026-04-22  
**Status:** Active  

---

## Scope

Taskplane internal development tasks. Tasks for building and improving the Taskplane package itself are created here.

Taskplane is an AI agent orchestration system built as a pi package. It provides:
- Single-task autonomous execution (`/task`)
- Dependency-aware parallel orchestration (`/orch*`)
- File-backed state, resumability, and observability

> **Historical note (testing):** Older task packets in this folder may reference
> Vitest commands. Those references are archival snapshots. Use Node.js native
> test runner commands for current work.

---

## Current Tasks

_(none pending — all reset to fresh state)_

---

## Key Files

| Category | Path |
|----------|------|
| Tasks | `taskplane-tasks/` |
| Config | `.pi/task-runner.yaml`, `.pi/task-orchestrator.yaml` |
| Extensions | `extensions/task-runner.ts`, `extensions/task-orchestrator.ts` |
| Orchestrator modules | `extensions/taskplane/` |
| Tests | `extensions/tests/` |
| CLI | `bin/taskplane.mjs` |
| Dashboard | `dashboard/` |
| Templates | `templates/` |
| Skills | `skills/` |

---

## Completed Tasks (archival)

All tasks from TP-001 through TP-182 have been executed and their results merged into the extension source. This context is kept for historical reference only.
