import { defineConfig } from "vitest/config";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@mariozechner/pi-coding-agent": resolve(__dirname, "tests/mocks/pi-coding-agent.ts"),
			"@mariozechner/pi-tui": resolve(__dirname, "tests/mocks/pi-tui.ts"),
		},
	},
	test: {
		include: ["tests/**/*.test.ts"],
		testTimeout: 60_000,
	},
});
