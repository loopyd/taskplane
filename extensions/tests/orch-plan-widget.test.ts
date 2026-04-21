import { describe, it } from "node:test";

import { expect } from "./expect.ts";
import { createOrchPlanWidget } from "../taskplane/formatting.ts";
import { buildOrchPlanWidgetLines, serializeOrchPlanWidgetLines } from "../taskplane/messages.ts";

describe("orch plan widget lines", () => {
	it("splits multiline sections and keeps blank separators between sections", () => {
		const lines = buildOrchPlanWidgetLines([
			"Preflight Check:\n✅ git\nAll required checks passed.",
			"📋 Discovery Results\nPending tasks: 20",
			"🌊 Execution Plan: 6 wave(s)",
		]);

		expect(lines).toEqual([
			"Preflight Check:",
			"✅ git",
			"All required checks passed.",
			"",
			"📋 Discovery Results",
			"Pending tasks: 20",
			"",
			"🌊 Execution Plan: 6 wave(s)",
		]);
	});

	it("drops empty sections and normalizes CRLF input", () => {
		const lines = buildOrchPlanWidgetLines([
			null,
			"",
			"Section A\r\nLine 2\r\n",
			undefined,
			"Section B",
		]);

		expect(lines).toEqual([
			"Section A",
			"Line 2",
			"",
			"Section B",
		]);
	});

	it("renders a component widget so content is not capped at ten lines", () => {
		const factory = createOrchPlanWidget({
			commandTitle: "/orch-plan all --sync",
			status: "running",
			phase: "Computing waves",
			sections: [Array.from({ length: 12 }, (_, index) => `Line ${index + 1}`).join("\n")],
		});

		expect(factory).toBeDefined();

		const widget = factory!(undefined, {
			fg: (_color: string, text: string) => text,
			bold: (text: string) => text,
		});
		const rendered = widget.render(80).join("\n");

		expect(rendered).toContain("/orch-plan all --sync");
		expect(rendered).toContain("Computing waves");
		expect(rendered).toContain("Line 12");
		expect(rendered).not.toContain("... (widget truncated)");
	});

	it("renders a solid bordered box and wraps to the inner box width", () => {
		const factory = createOrchPlanWidget({
			commandTitle: "/orch-plan all",
			status: "success",
			phase: "Plan ready",
			sections: ["This line is long enough to wrap across multiple rows in the widget body."],
		});

		expect(factory).toBeDefined();

		const widget = factory!(undefined, {
			fg: (_color: string, text: string) => text,
			bold: (text: string) => text,
		});
		const rendered = widget.render(20);

		expect(rendered[0]).toBe(`┌${"─".repeat(18)}┐`);
		expect(rendered[rendered.length - 1]).toBe(`└${"─".repeat(18)}┘`);

		for (const line of rendered.slice(1, -1)) {
			expect(line).toHaveLength(20);
			expect(line.startsWith("│ ")).toBeTruthy();
			expect(line.endsWith(" │")).toBeTruthy();
		}
	});

	it("serializes a plain fallback header with title and terminal status", () => {
		const lines = serializeOrchPlanWidgetLines({
			commandTitle: "/orch-plan all --sync",
			status: "error",
			phase: "Workspace sync required",
			sections: ["⚠️ Workspace sync is required before continuing."],
		});

		expect(lines).toEqual([
			"/orch-plan all --sync",
			"✗ Workspace sync required",
			"",
			"⚠️ Workspace sync is required before continuing.",
		]);
	});
});