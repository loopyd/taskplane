import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { expect } from "./expect.ts";
import { resolveTaskWorkerAgentId } from "../taskplane/engine.ts";
import type { AllocatedLane } from "../taskplane/types.ts";

const laneRunnerSrc = readFileSync(new URL("../taskplane/lane-runner.ts", import.meta.url), "utf-8");
const engineSrc = readFileSync(new URL("../taskplane/engine.ts", import.meta.url), "utf-8");

describe("review blocker regressions", () => {
	it("uses portable bridge extension path resolution", () => {
		expect(laneRunnerSrc).toMatch(
			/const bridgeExtensionPath = join\(LANE_RUNNER_DIR,\s*"agent-bridge-extension\.ts"\);/,
		);
		expect(laneRunnerSrc).not.toContain(
			'const bridgeExtensionPath = join(\n\t\t\tconfig.stateRoot,\n\t\t\t".pi",\n\t\t\t"git",',
		);
	});

	it("prefers STATUS current step before iteration-hint fallback in snapshots", () => {
		expect(laneRunnerSrc).toContain("const currentStepFromStatus = currentStepMatch?.[1]?.trim() || \"\";");
		expect(laneRunnerSrc).toContain("currentStepFromStatus && currentStepFromStatus !== \"Unknown\"");
		expect(laneRunnerSrc).toContain(": (currentStepNameOverride ?? \"Unknown\");");
	});

	it("engine source does not mask invariant failures with optional find", () => {
		expect(engineSrc).not.toContain("?.find(");
	});

	it("resolveTaskWorkerAgentId fails fast when allTaskOutcomes invariant is broken", () => {
		const laneByTaskId = new Map<string, AllocatedLane>();
		expect(() => resolveTaskWorkerAgentId("TP-999", undefined as any, laneByTaskId)).toThrow(TypeError);
	});
});
