# Taskplane

Multi-agent AI orchestration for [pi](https://github.com/badlogic/pi-mono) — parallel task execution with checkpoint discipline, fresh-context worker loops, cross-model reviews, and automated merges.

> **Status:** Experimental / Early — APIs and config formats may change between releases.

## What It Does

Taskplane turns your coding project into an AI-managed task board. You define tasks as structured markdown files. Taskplane's agents execute them autonomously — one at a time with `/task`, or many in parallel with `/orch`.

### Key Features

- **Task Runner** (`/task`) — Autonomous single-task execution. Workers run in fresh-context loops with STATUS.md as persistent memory. Every checkbox gets a git checkpoint. Cross-model reviewers catch what the worker missed.
- **Task Orchestrator** (`/orch`) — Parallel multi-task execution using git worktrees for full filesystem isolation. Dependency-aware wave scheduling. Automated merges with conflict resolution.
- **Web Dashboard** — Live browser-based monitoring via `taskplane dashboard`. SSE streaming, lane/task progress, wave visualization, batch history.
- **Structured Tasks** — PROMPT.md defines the mission, steps, and constraints. STATUS.md tracks progress. Agents follow the plan, not vibes.
- **Checkpoint Discipline** — Every completed checkbox item triggers a git commit. Work is never lost, even if a worker crashes mid-task.
- **Cross-Model Review** — Reviewer agent uses a different model than the worker. Independent quality gate before merge.

## Install

Taskplane is a [pi package](https://github.com/badlogic/pi-mono). You need [Node.js](https://nodejs.org/) ≥ 20 and [pi](https://github.com/badlogic/pi-mono) installed first.

### Option A: Global Install (all projects)

```bash
pi install npm:taskplane
```

### Option B: Project-Local Install (recommended for teams)

```bash
cd my-project
pi install -l npm:taskplane
```

Then scaffold your project:

```bash
taskplane init
```

Verify the installation:

```bash
taskplane doctor
```

## Quickstart

### 1. Initialize a project

```bash
cd my-project
taskplane init --preset full
```

This creates config files in `.pi/`, agent prompts, and an example task.

### 2. Run your first task

```bash
pi
```

Inside the pi session:

```
/task taskplane-tasks/EXAMPLE-001-hello-world/PROMPT.md
```

Watch the worker agent execute each step, checkpoint its progress, and complete the task.

### 3. Monitor progress

```
/task-status
```

### 4. Run parallel orchestration

Once you have multiple tasks staged:

```
/orch-plan all     # Preview the execution plan (waves, lanes, dependencies)
/orch all          # Execute all pending tasks in parallel
/orch-status       # Monitor batch progress
```

### 5. Launch the dashboard

In a separate terminal:

```bash
taskplane dashboard
```

Opens a live web dashboard at `http://localhost:8099` with real-time batch monitoring.

## Commands

### Pi Session Commands

| Command | Description |
|---------|-------------|
| `/task <path/to/PROMPT.md>` | Execute a single task autonomously |
| `/task-status` | Show current task progress |
| `/task-pause` | Pause after current worker iteration finishes |
| `/task-resume` | Resume a paused task |
| `/orch <areas\|paths\|all>` | Start parallel batch execution |
| `/orch-plan <areas\|paths\|all>` | Preview execution plan without running |
| `/orch-status` | Show batch progress |
| `/orch-pause` | Pause batch after current tasks finish |
| `/orch-resume` | Resume a paused batch |
| `/orch-abort [--hard]` | Abort batch (graceful or immediate) |
| `/orch-deps <areas\|paths\|all>` | Show dependency graph |
| `/orch-sessions` | List active worker sessions |

### CLI Commands

| Command | Description |
|---------|-------------|
| `taskplane init` | Scaffold project config (interactive or `--preset`) |
| `taskplane doctor` | Validate installation and config |
| `taskplane version` | Show version info |
| `taskplane dashboard` | Launch the web dashboard |

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (/orch)                      │
│  Parse tasks → Build dependency DAG → Compute waves         │
│  Assign lanes → Spawn workers → Monitor → Merge             │
└──────┬──────────┬──────────┬────────────────────────────────┘
       │          │          │
  ┌────▼────┐ ┌──▼─────┐ ┌──▼─────┐
  │ Lane 1  │ │ Lane 2 │ │ Lane 3 │    ← Git worktrees
  │ /task   │ │ /task  │ │ /task  │       (isolated)
  │ Worker  │ │ Worker │ │ Worker │
  │ Review  │ │ Review │ │ Review │
  └────┬────┘ └──┬─────┘ └──┬─────┘
       │         │          │
       └─────────┼──────────┘
                 │
          ┌──────▼──────┐
          │ Merge Agent │    ← Conflict resolution
          │ Integration │      & verification
          │   Branch    │
          └─────────────┘
```

**Single task** (`/task`): Worker iterates in fresh-context loops. STATUS.md is persistent memory. Each checkbox → git checkpoint. Reviewer validates on completion.

**Parallel batch** (`/orch`): Tasks are sorted into dependency waves. Each wave runs in parallel across lanes (git worktrees). Completed lanes merge into the integration branch before the next wave starts.

## Documentation

📖 **[Full Documentation](docs/README.md)**

Start at the docs index for tutorials, how-to guides, reference docs, and architecture explanations.

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for development setup, testing, and contribution guidelines.

## License

[MIT](LICENSE) © Henry Lach
