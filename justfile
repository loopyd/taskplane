default:
    @just --list

# Task Orchestrator: parallel task execution with /orch commands + /task for single tasks
orch:
    pi -e extensions/task-orchestrator.ts -e extensions/task-runner.ts

# Task Runner only: /task for single task execution (no orchestration)
task:
    pi -e extensions/task-runner.ts
