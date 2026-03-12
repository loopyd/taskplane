#!/usr/bin/env node
/**
 * Orchestrator Dashboard — Standalone terminal monitor
 *
 * Reads batch-state.json, STATUS.md files, and tmux sessions to render
 * a live multi-panel dashboard. Runs independently from the orchestrator.
 *
 * Usage:
 *   node extensions/orch-dashboard.cjs [--interval <ms>] [--no-status] [--once]
 *
 * Options:
 *   --interval <ms>   Poll interval in milliseconds (default: 3000, min: 1000)
 *   --no-status       Skip STATUS.md parsing (faster, less detail)
 *   --once            Render one snapshot and exit
 *
 * Requires: Node.js 18+. No external dependencies.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

// ─── Configuration ──────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, "..");
const BATCH_STATE_PATH = path.join(REPO_ROOT, ".pi", "batch-state.json");
const DEFAULT_INTERVAL = 3000;
const MIN_INTERVAL = 1000;

// ─── ANSI Helpers ───────────────────────────────────────────────────────────

const ESC = "\x1b";
const CSI = `${ESC}[`;

const cursor = {
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`,
  wrapOff: `${CSI}?7l`,
  wrapOn: `${CSI}?7h`,
  home: `${CSI}H`,
  clear: `${CSI}2J${CSI}H`,
  eraseDown: `${CSI}J`,       // erase from cursor to end of screen (no scrollback push)
  eraseLine: `${CSI}2K`,      // erase entire current line
  to: (row, col) => `${CSI}${row};${col}H`,
};

const style = {
  reset: `${CSI}0m`,
  bold: (s) => `${CSI}1m${s}${CSI}0m`,
  dim: (s) => `${CSI}2m${s}${CSI}0m`,
  green: (s) => `${CSI}32m${s}${CSI}0m`,
  red: (s) => `${CSI}31m${s}${CSI}0m`,
  yellow: (s) => `${CSI}33m${s}${CSI}0m`,
  blue: (s) => `${CSI}34m${s}${CSI}0m`,
  cyan: (s) => `${CSI}36m${s}${CSI}0m`,
  magenta: (s) => `${CSI}35m${s}${CSI}0m`,
  white: (s) => `${CSI}37m${s}${CSI}0m`,
  bgGreen: (s) => `${CSI}42;30m${s}${CSI}0m`,
  bgRed: (s) => `${CSI}41;37m${s}${CSI}0m`,
  bgYellow: (s) => `${CSI}43;30m${s}${CSI}0m`,
  bgBlue: (s) => `${CSI}44;37m${s}${CSI}0m`,
  bgCyan: (s) => `${CSI}46;30m${s}${CSI}0m`,
};

// Strip ANSI codes for length calculation
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");

const BOX = {
  tl: "┌", tr: "┐", bl: "└", br: "┘",
  h: "─", v: "│", tee: "├", teeR: "┤",
  cross: "┼", teeD: "┬", teeU: "┴",
};

function hline(width, left = BOX.h, right = BOX.h) {
  return left + BOX.h.repeat(Math.max(0, width - 2)) + right;
}

function pad(s, width) {
  const vis = stripAnsi(s);
  if (vis.length >= width) return s.slice(0, s.length - vis.length + width);
  return s + " ".repeat(width - vis.length);
}

function truncate(s, maxLen) {
  if (maxLen <= 0) return "";
  const vis = stripAnsi(s);
  if (vis.length <= maxLen) return s;
  // Simple truncation (works for non-ANSI strings)
  return s.slice(0, maxLen - 1) + "…";
}

function formatDuration(ms) {
  if (!ms || ms <= 0) return "--:--";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h${String(m).padStart(2, "0")}m`;
  return `${m}m${String(s).padStart(2, "0")}s`;
}

function formatTime(epochMs) {
  if (!epochMs) return "--:--:--";
  return new Date(epochMs).toLocaleTimeString();
}

function relativeTime(epochMs) {
  if (!epochMs) return "";
  const diff = Date.now() - epochMs;
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

// ─── Data Loading ───────────────────────────────────────────────────────────

function loadBatchState() {
  try {
    const raw = fs.readFileSync(BATCH_STATE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function resolveTaskFolder(task, state) {
  if (!task || !task.taskFolder) return null;

  const laneNum = task.laneNumber;
  const lane = (state?.lanes || []).find((l) => l.laneNumber === laneNum);

  // If no lane mapping is available, use the persisted folder as-is.
  if (!lane || !lane.worktreePath) return task.taskFolder;

  const taskFolderAbs = path.resolve(task.taskFolder);
  const repoRootAbs = path.resolve(REPO_ROOT);
  const rel = path.relative(repoRootAbs, taskFolderAbs);

  // Only remap when taskFolder is under repo root.
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    return task.taskFolder;
  }

  return path.join(lane.worktreePath, rel);
}

function parseStatusMd(taskFolder) {
  // Check both primary and archive paths
  const candidates = [taskFolder];
  const taskId = path.basename(taskFolder);
  const archiveBase = taskFolder.replace(/[/\\]tasks[/\\][^/\\]+$/, "/tasks/archive/" + taskId);
  if (archiveBase !== taskFolder) candidates.push(archiveBase);

  for (const folder of candidates) {
    const statusPath = path.join(folder, "STATUS.md");
    try {
      const content = fs.readFileSync(statusPath, "utf-8");
      const stepMatch = content.match(/\*\*Current Step:\*\*\s*(.+)/);
      const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/);
      const iterMatch = content.match(/\*\*Iteration:\*\*\s*(\d+)/);
      const reviewMatch = content.match(/\*\*Review Counter:\*\*\s*(\d+)/);

      // Count checkboxes
      const checked = (content.match(/- \[x\]/gi) || []).length;
      const unchecked = (content.match(/- \[ \]/g) || []).length;
      const total = checked + unchecked;

      return {
        currentStep: stepMatch ? stepMatch[1].trim() : "Unknown",
        status: statusMatch ? statusMatch[1].trim() : "Unknown",
        iteration: iterMatch ? parseInt(iterMatch[1]) : 0,
        reviews: reviewMatch ? parseInt(reviewMatch[1]) : 0,
        checked,
        total,
        progress: total > 0 ? Math.round((checked / total) * 100) : 0,
      };
    } catch {
      continue;
    }
  }
  return null;
}

function getTmuxSessions() {
  try {
    const output = execFileSync('tmux list-sessions -F "#{session_name}"', {
      encoding: "utf-8",
      timeout: 5000,
      shell: true,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return output ? output.split("\n").map((s) => s.trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function checkDoneFile(taskFolder) {
  const candidates = [taskFolder];
  const taskId = path.basename(taskFolder);
  const archiveBase = taskFolder.replace(/[/\\]tasks[/\\][^/\\]+$/, "/tasks/archive/" + taskId);
  if (archiveBase !== taskFolder) candidates.push(archiveBase);

  for (const folder of candidates) {
    if (fs.existsSync(path.join(folder, ".DONE"))) return true;
  }
  return false;
}

// ─── Rendering ──────────────────────────────────────────────────────────────

function statusIcon(status) {
  switch (status) {
    case "succeeded": return style.green("✓");
    case "running": return style.cyan("▶");
    case "failed": return style.red("✗");
    case "stalled": return style.yellow("⏸");
    case "pending": return style.dim("○");
    case "skipped": return style.dim("⊘");
    default: return style.dim("?");
  }
}

function statusColor(status, text) {
  switch (status) {
    case "succeeded": return style.green(text);
    case "running": return style.cyan(text);
    case "failed": return style.red(text);
    case "stalled": return style.yellow(text);
    case "pending": return style.dim(text);
    case "skipped": return style.dim(text);
    default: return text;
  }
}

function phaseColor(phase) {
  switch (phase) {
    case "executing": return style.bgCyan(` ${phase.toUpperCase()} `);
    case "merging": return style.bgBlue(` ${phase.toUpperCase()} `);
    case "completed": return style.bgGreen(` ${phase.toUpperCase()} `);
    case "paused": return style.bgYellow(` ${phase.toUpperCase()} `);
    case "stopped": case "aborted": return style.bgRed(` ${phase.toUpperCase()} `);
    default: return style.bold(phase);
  }
}

function progressBar(pct, width = 20) {
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  if (pct >= 100) return style.green(bar);
  if (pct >= 50) return style.cyan(bar);
  if (pct > 0) return style.yellow(bar);
  return style.dim(bar);
}

function renderDashboard(state, statusData, tmuxSessions, opts) {
  const terminalWidth = process.stdout.columns || 120;
  const width = Math.max(60, terminalWidth - 1); // leave 1 column to avoid hard-wrap artifacts
  const height = process.stdout.rows || 40;
  // Live mode: home cursor + erase-to-end-of-screen.
  // This redraws in-place WITHOUT pushing frames into scrollback.
  // cursor.clear (ESC[2J) pushes old content into scrollback → looks like repeating.
  // cursor.home + eraseDown avoids that entirely.
  const liveInteractive = opts.interactive && !opts.once;
  let out = liveInteractive ? cursor.home : "";

  const now = new Date();
  const timeStr = now.toLocaleTimeString();

  // ── Header ──
  const title = style.bold("Orchestrator Dashboard");
  const batchInfo = state
    ? `Batch: ${style.cyan(state.batchId)} ${phaseColor(state.phase)}`
    : style.red("No batch running");
  const refreshInfo = style.dim(`${timeStr} · refresh: ${opts.interval}ms`);

  // Keep header on a single line to avoid wrapping artifacts on narrow terminals.
  let headerLine = `${title}  ${batchInfo}  ${refreshInfo}`;
  if (stripAnsi(headerLine).length > width) {
    headerLine = `${title}  ${batchInfo}`;
  }
  if (stripAnsi(headerLine).length > width) {
    headerLine = title;
  }
  out += `${headerLine}\n`;
  out += style.dim(hline(width, BOX.tl, BOX.tr)) + "\n";

  if (!state) {
    out += `\n  ${style.dim("No .pi/batch-state.json found.")}\n`;
    out += `  ${style.dim("Start an orchestrator batch to see the dashboard.")}\n`;
    process.stdout.write(out);
    return;
  }

  // ── Wave Plan ──
  const waveIdx = state.currentWaveIndex || 0;
  const totalWaves = state.totalWaves || (state.wavePlan ? state.wavePlan.length : 0);
  let waveStr = `${style.dim(BOX.v)} ${style.bold("Waves")} `;
  if (state.wavePlan) {
    for (let i = 0; i < state.wavePlan.length; i++) {
      const tasks = state.wavePlan[i];
      const isCurrent = i === waveIdx && state.phase === "executing";
      const isDone = i < waveIdx || state.phase === "completed" || state.phase === "merging";
      const label = `W${i + 1}[${tasks.join(",")}]`;
      if (isDone) waveStr += style.green(label) + " ";
      else if (isCurrent) waveStr += style.cyan(style.bold(label)) + " ";
      else waveStr += style.dim(label) + " ";
    }
  }
  out += waveStr + "\n";

  // ── Summary Stats ──
  const tasks = state.tasks || [];
  const succeeded = tasks.filter((t) => t.status === "succeeded").length;
  const running = tasks.filter((t) => t.status === "running").length;
  const failed = tasks.filter((t) => t.status === "failed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const stalled = tasks.filter((t) => t.status === "stalled").length;
  const total = tasks.length;

  const overallPct = total > 0 ? Math.round((succeeded / total) * 100) : 0;
  const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;

  let statsStr = `${style.dim(BOX.v)} `;
  statsStr += `${progressBar(overallPct, 15)} ${overallPct}%  `;
  statsStr += `${style.green(succeeded + "✓")} `;
  statsStr += `${style.cyan(running + "▶")} `;
  if (failed > 0) statsStr += `${style.red(failed + "✗")} `;
  if (stalled > 0) statsStr += `${style.yellow(stalled + "⏸")} `;
  if (pending > 0) statsStr += `${style.dim(pending + "○")} `;
  statsStr += `${style.dim("/ " + total + " tasks")}  `;
  statsStr += style.dim(`elapsed: ${formatDuration(elapsed)}`);
  if (state.updatedAt) statsStr += style.dim(`  updated: ${relativeTime(state.updatedAt)}`);
  out += statsStr + "\n";

  out += style.dim(hline(width, BOX.tee, BOX.teeR)) + "\n";

  // ── Lanes Panel ──
  const lanes = state.lanes || [];
  if (lanes.length > 0) {
    out += `${style.dim(BOX.v)} ${style.bold("Lanes")}\n`;

    // Column headers
    const colHeader = `${style.dim(BOX.v)}  # ${pad("Session", 16)} ${pad("Branch", 30)} ${pad("Tmux", 5)} ${pad("Tasks", 20)}`;
    out += style.dim(colHeader) + "\n";

    for (const lane of lanes) {
      const tmuxAlive = tmuxSessions.includes(lane.tmuxSessionName);
      const tmuxDot = tmuxAlive ? style.green("●") : style.red("○");
      const laneTasks = (lane.taskIds || []).map((tid) => {
        const t = tasks.find((x) => x.taskId === tid);
        if (!t) return style.dim(tid);
        return `${statusIcon(t.status)} ${tid}`;
      }).join("  ");

      out += `${style.dim(BOX.v)} ${pad(String(lane.laneNumber), 2)} `;
      out += `${pad(style.cyan(lane.tmuxSessionName), 16)} `;
      out += `${pad(style.dim(truncate(lane.branch, 28)), 30)} `;
      out += `${pad(tmuxDot, 5)} `;
      out += laneTasks;
      out += "\n";
    }
    out += style.dim(hline(width, BOX.tee, BOX.teeR)) + "\n";
  }

  // ── Tasks Detail Panel ──
  out += `${style.dim(BOX.v)} ${style.bold("Tasks")}\n`;

  // Column headers
  const taskColHeader = `${style.dim(BOX.v)}  St ${pad("Task ID", 12)} ${pad("Lane", 4)} ${pad("Status", 10)} ${pad("Duration", 9)} ${pad("Progress", 30)} ${pad("Current Step", 40)}`;
  out += style.dim(taskColHeader) + "\n";
  out += style.dim(hline(width, BOX.tee, BOX.teeR)) + "\n";

  for (const task of tasks) {
    const sd = statusData[task.taskId];
    const dur = task.startedAt
      ? formatDuration((task.endedAt || Date.now()) - task.startedAt)
      : "--:--";

    let progStr = "";
    let stepStr = "";

    if (sd) {
      const countStr = `${sd.checked}/${sd.total}`;
      progStr = `${progressBar(sd.progress, 15)} ${String(sd.progress).padStart(3)}% ${countStr.padStart(7)}`;
      stepStr = truncate(sd.currentStep, 38);
      if (sd.iteration > 0) stepStr += style.dim(` i${sd.iteration}`);
      if (sd.reviews > 0) stepStr += style.dim(` r${sd.reviews}`);
    } else if (task.status === "succeeded") {
      progStr = `${progressBar(100, 15)} 100%`;
      stepStr = style.green("Complete");
    } else if (task.status === "pending") {
      progStr = `${progressBar(0, 15)}   0%`;
      stepStr = style.dim("Waiting");
    } else {
      progStr = style.dim("--");
      stepStr = task.exitReason || "";
    }

    const laneStr = task.laneNumber > 0 ? String(task.laneNumber) : style.dim("-");

    out += `${style.dim(BOX.v)} ${statusIcon(task.status)}  `;
    out += `${pad(statusColor(task.status, task.taskId), 12)} `;
    out += `${pad(laneStr, 4)} `;
    out += `${pad(statusColor(task.status, task.status), 10)} `;
    out += `${pad(dur, 9)} `;
    out += `${pad(progStr, 30)} `;
    out += truncate(stepStr, Math.max(10, width - 82));
    out += "\n";
  }

  // ── Merge Results ──
  const merges = state.mergeResults || [];
  if (merges.length > 0) {
    out += style.dim(hline(width, BOX.tee, BOX.teeR)) + "\n";
    out += `${style.dim(BOX.v)} ${style.bold("Merge Results")}\n`;
    for (const mr of merges) {
      const mrIcon = mr.status === "succeeded" ? style.green("✓")
        : mr.status === "partial" ? style.yellow("⚠")
        : style.red("✗");
      let line = `${style.dim(BOX.v)}  ${mrIcon} Wave ${mr.waveIndex + 1}: ${mr.status}`;
      if (mr.failureReason) line += style.dim(` — ${mr.failureReason}`);
      out += line + "\n";
    }
  }

  // ── Errors ──
  const errors = state.errors || [];
  if (errors.length > 0) {
    out += style.dim(hline(width, BOX.tee, BOX.teeR)) + "\n";
    out += `${style.dim(BOX.v)} ${style.bold(style.red("Errors"))}\n`;
    for (const err of errors.slice(-5)) {
      out += `${style.dim(BOX.v)}  ${style.red("•")} ${truncate(typeof err === "string" ? err : err.message || JSON.stringify(err), width - 6)}\n`;
    }
  }

  // ── Footer ──
  out += style.dim(hline(width, BOX.bl, BOX.br)) + "\n";

  const footerHints = [
    style.dim("Ctrl+C to exit"),
    state.phase === "executing" ? style.dim("Tasks running in tmux sessions") : null,
    state.lastError ? style.red(`Last error: ${truncate(state.lastError, 40)}`) : null,
  ].filter(Boolean).join("  │  ");
  out += `  ${footerHints}\n`;

  // Erase everything below the last rendered line.
  // This cleans up stale content from previous frames that had more rows
  // (e.g. after errors section disappears, or terminal gets taller).
  if (liveInteractive) {
    out += cursor.eraseDown;
  }

  process.stdout.write(out);
}

// ─── Main Loop ──────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    interval: DEFAULT_INTERVAL,
    parseStatus: true,
    once: false,
    interactive: !!process.stdout.isTTY,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--interval" && args[i + 1]) {
      opts.interval = Math.max(MIN_INTERVAL, parseInt(args[i + 1]) || DEFAULT_INTERVAL);
      i++;
    } else if (args[i] === "--no-status") {
      opts.parseStatus = false;
    } else if (args[i] === "--once") {
      opts.once = true;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Orchestrator Dashboard — Standalone terminal monitor

Usage:
  node extensions/orch-dashboard.cjs [options]

Options:
  --interval <ms>   Poll interval (default: ${DEFAULT_INTERVAL}, min: ${MIN_INTERVAL})
  --no-status       Skip STATUS.md parsing (faster, less detail)
  --once            Render one snapshot and exit
  -h, --help        Show this help
`);
      process.exit(0);
    }
  }

  // Non-interactive outputs (logs, pipes, some terminals) should not redraw.
  if (!opts.interactive) {
    opts.once = true;
  }

  return opts;
}

function main() {
  const opts = parseArgs();
  let running = true;

  // Initial setup: hide cursor, disable line-wrap, clear screen once.
  // Subsequent frames use home + eraseDown (no scrollback push).
  // Wrap-off prevents long lines from creating phantom second rows on resize.
  if (opts.interactive && !opts.once) {
    process.stdout.write(cursor.hide + cursor.wrapOff + cursor.clear);
  } else if (opts.interactive) {
    process.stdout.write(cursor.hide);
  }

  function restoreTerminal() {
    if (opts.interactive) {
      process.stdout.write(cursor.wrapOn + cursor.show + cursor.clear);
    }
  }

  function cleanup() {
    running = false;
    restoreTerminal();
    process.exit(0);
  }

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("uncaughtException", (err) => {
    restoreTerminal();
    console.error("Dashboard error:", err.message);
    process.exit(1);
  });

  // On terminal resize, do a real full clear to wipe any wrapped ghost lines.
  // The next regular tick (home-based) will redraw cleanly from there.
  if (opts.interactive && !opts.once) {
    process.stdout.on("resize", () => {
      process.stdout.write(cursor.clear);
    });
  }

  function tick() {
    if (!running) return;

    const state = loadBatchState();
    const tmuxSessions = getTmuxSessions();

    // Parse STATUS.md for each task
    const statusData = {};
    if (opts.parseStatus && state && state.tasks) {
      for (const task of state.tasks) {
        const effectiveTaskFolder = resolveTaskFolder(task, state);
        if (effectiveTaskFolder && (task.status === "running" || task.status === "succeeded")) {
          const sd = parseStatusMd(effectiveTaskFolder);
          if (sd) statusData[task.taskId] = sd;

          // Also check for .DONE if not already flagged
          if (!task.doneFileFound) {
            task.doneFileFound = checkDoneFile(effectiveTaskFolder);
          }
        }
      }
    }

    renderDashboard(state, statusData, tmuxSessions, opts);
    if (!opts.once) {
      setTimeout(tick, opts.interval);
    }
  }

  tick();
}

main();
