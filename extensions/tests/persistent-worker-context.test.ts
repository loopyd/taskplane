import { describe, it } from "node:test";
import { expect } from "./expect.ts";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASK_RUNNER_PATH = resolve(__dirname, "../task-runner.ts");

function readSource(): string {
	return readFileSync(TASK_RUNNER_PATH, "utf-8");
}

function extractRegion(src: string, marker: string): string {
	const start = src.indexOf(marker);
	if (start < 0) throw new Error(`marker not found: ${marker}`);
	const rest = src.slice(start + 1);
	const nextSection = rest.search(/\n\t\/\/ ── /);
	return nextSection < 0 ? src.slice(start) : src.slice(start, start + 1 + nextSection);
}

describe("persistent worker context contracts (subprocess mode)", () => {
	const src = readSource();
	const runWorkerBlock = extractRegion(src, "\tasync function runWorker(");

	it("passes warn/kill thresholds into subprocess spawn", () => {
		expect(runWorkerBlock).toContain("const warnPct = config.context.warn_percent");
		expect(runWorkerBlock).toContain("const killPct = config.context.kill_percent");
		expect(runWorkerBlock).toContain("warnPct,");
		expect(runWorkerBlock).toContain("killPct,");
	});

	it("tracks context pressure via onContextPct and writes wrap-up signal", () => {
		expect(runWorkerBlock).toContain("onContextPct: (pct) => {");
		expect(runWorkerBlock).toContain("state.workerContextPct = pct");
		expect(runWorkerBlock).toContain("if (pct >= warnPct)");
		expect(runWorkerBlock).toContain("writeWrapUpSignal(`Wrap up (context ${Math.round(pct)}%)`)");
	});

	it("removes tmux wall-clock/context kill branches", () => {
		expect(runWorkerBlock).not.toContain("if (spawnMode === \"tmux\")");
		expect(runWorkerBlock).not.toContain("wallClockWarnTimer");
		expect(runWorkerBlock).not.toContain("wallClockKillTimer");
		expect(runWorkerBlock).not.toContain("tmux worker:");
	});

	it("keeps subprocess conversation sidecar wiring in orchestrated mode", () => {
		expect(runWorkerBlock).toContain("const conversationPrefix = isOrchestratedMode() ? getLanePrefix() : null");
		expect(runWorkerBlock).toContain("appendConversationEvent(conversationPrefix");
	});
});
