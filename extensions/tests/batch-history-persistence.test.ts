import { describe, it } from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

import { expect } from "./expect.ts";
import { loadBatchHistory, saveBatchHistory } from "../taskplane/persistence.ts";
import { withPreservedBatchHistory } from "../taskplane/extension.ts";
import type { BatchHistorySummary } from "../taskplane/types.ts";

function makeSummary(batchId: string, status: BatchHistorySummary["status"], startedAt = 1000): BatchHistorySummary {
	return {
		batchId,
		status,
		startedAt,
		endedAt: startedAt + 500,
		durationMs: 500,
		totalWaves: 1,
		totalTasks: 1,
		succeededTasks: status === "completed" ? 1 : 0,
		failedTasks: status === "failed" ? 1 : 0,
		skippedTasks: 0,
		blockedTasks: 0,
		tokens: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0, costUsd: 0.01 },
		tasks: [{
			taskId: "TP-137",
			taskName: "TP-137",
			status: status === "failed" ? "failed" : "succeeded",
			wave: 1,
			lane: 1,
			durationMs: 500,
			tokens: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0, costUsd: 0.01 },
			exitReason: null,
		}],
		waves: [{
			wave: 1,
			tasks: ["TP-137"],
			mergeStatus: "succeeded",
			durationMs: 500,
			tokens: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0, costUsd: 0.01 },
		}],
	};
}

describe("batch history persistence", () => {
	it("saveBatchHistory writes entries and keeps newest first", () => {
		const root = mkdtempSync(join(tmpdir(), "tp-137-history-"));
		try {
			saveBatchHistory(root, makeSummary("batch-old", "completed", 1000));
			saveBatchHistory(root, makeSummary("batch-new", "completed", 2000));

			const history = loadBatchHistory(root);
			expect(history).toHaveLength(2);
			expect(history[0].batchId).toBe("batch-new");
			expect(history[1].batchId).toBe("batch-old");
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	});

	it("withPreservedBatchHistory restores pre-integration history snapshot", () => {
		const root = mkdtempSync(join(tmpdir(), "tp-137-preserve-"));
		const piDir = join(root, ".pi");
		const historyPath = join(piDir, "batch-history.json");
		mkdirSync(piDir, { recursive: true });
		const original = JSON.stringify([makeSummary("batch-live", "completed", 3000)], null, 2);
		writeFileSync(historyPath, original, "utf-8");

		try {
			const result = withPreservedBatchHistory(root, () => {
				writeFileSync(historyPath, JSON.stringify([makeSummary("batch-stale", "failed", 1000)], null, 2), "utf-8");
				return "ok";
			});

			expect(result).toBe("ok");
			expect(readFileSync(historyPath, "utf-8")).toBe(original);
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	});
});
