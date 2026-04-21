/**
 * Settings Loader — Reads .pi/settings.json packages for agent spawning.
 *
 * Taskplane spawns worker, reviewer, and merge subprocesses with --no-extensions,
 * which disables all auto-discovered packages from .pi/settings.json.
 * This module provides a utility to read those packages so callers can pass them
 * explicitly as -e flags when spawning agents.
 *
 * ## Cascade
 *
 * 1. Global: `~/.pi/agent/settings.json` (resolved via PI `getAgentDir()` — handles
 *    `PI_CODING_AGENT_DIR` env var, tilde expansion, cross-platform homedir).
 * 2. Project: `<stateRoot>/.pi/settings.json` (overrides global).
 *
 * Project packages take priority over global packages (arrays are replaced,
 * not merged). If project has no `packages` key, global packages are used.
 *
 * ## Usage
 *
 * ```ts
 * import { loadPiSettingsPackages } from "./settings-loader.ts";
 *
 * const packages = loadPiSettingsPackages(stateRoot);
 * if (packages) {
 *   const projectPackages = packages.filter(p => !p.includes("taskplane"));
 *   // pass to spawnAgent via extensions field or -e flags
 * }
 * ```
 *
 * @module taskplane/settings-loader
 * @since TP-198
 */

import { readFileSync, existsSync } from "fs";
import { basename, isAbsolute, join, resolve } from "path";
import * as PiCodingAgent from "@mariozechner/pi-coding-agent";

/** Path to .pi/settings.json relative to project root */
const PROJECT_SETTINGS_FILE = ".pi/settings.json";

/**
 * Minimal shape of .pi/settings.json we care about.
 */
interface PiSettingsJson {
	packages?: string[];
	[key: string]: unknown;
}

const LOCAL_EXTENSION_ENTRYPOINTS = ["index.ts", "src/index.ts", "dist/index.js", "main.ts", "index.js"];

/**
 * Load the `packages` array from a .pi/settings.json file.
 *
 * Returns `null` if:
 * - The file does not exist
 * - The file is not valid JSON
 * - The file has no `packages` key or it is not an array
 *
 * @param settingsPath - Absolute path to settings.json
 * @returns Array of package specifiers or `null`
 */
function loadPackagesFromFile(settingsPath: string): string[] | null {
	if (!existsSync(settingsPath)) {
		return null;
	}

	try {
		const raw = readFileSync(settingsPath, "utf-8");
		const parsed = JSON.parse(raw) as PiSettingsJson;

		if (!Array.isArray(parsed.packages)) {
			return null;
		}

		// Validate: each entry must be a non-empty string
		const filtered = parsed.packages.filter((p): p is string => typeof p === "string" && p.trim().length > 0);

		return filtered.length > 0 ? filtered : null;
	} catch {
		// Malformed JSON — return null
		return null;
	}
}

/**
 * Load project packages from `<stateRoot>/.pi/settings.json`.
 */
function loadProjectPackages(stateRoot: string): string[] | null {
	return loadPackagesFromFile(join(stateRoot, PROJECT_SETTINGS_FILE));
}

/**
 * Load global packages from the PI agent config directory.
 *
 * Resolved via PI's `getAgentDir()` which handles:
 * - `PI_CODING_AGENT_DIR` env var (with tilde expansion)
 * - Falls back to `~/.pi/agent/` using cross-platform `os.homedir()`
 *
 * Global settings path: `<agentDir>/settings.json`
 */
function loadGlobalPackages(): string[] | null {
	const exportedGetAgentDir = (PiCodingAgent as { getAgentDir?: () => string }).getAgentDir;
	const fallbackAgentDir = join(process.env.HOME || process.env.USERPROFILE || "", ".pi", "agent");
	const agentDir = typeof exportedGetAgentDir === "function" ? exportedGetAgentDir() : fallbackAgentDir;
	const globalSettingsPath = join(agentDir, "settings.json");
	return loadPackagesFromFile(globalSettingsPath);
}

/**
 * Load merged packages from `.pi/settings.json`, cascading global → project.
 *
 * Project packages take priority over global packages. If project has no
 * `packages` key, falls back to global. If neither has packages, returns `null`.
 *
 * @param stateRoot - Absolute path to the project root (where `.pi/` lives)
 * @returns Merged array of package specifiers or `null`
 */
export function loadPiSettingsPackages(stateRoot: string): string[] | null {
	const projectPackages = loadProjectPackages(stateRoot);
	if (projectPackages !== null) {
		return projectPackages;
	}

	return loadGlobalPackages();
}

function resolveLocalPackageEntry(packageRoot: string): string {
	for (const relPath of LOCAL_EXTENSION_ENTRYPOINTS) {
		const candidate = join(packageRoot, relPath);
		if (existsSync(candidate)) return candidate;
	}
	return packageRoot;
}

function resolveLocalNpmPackage(packageName: string, stateRoot: string): string | null {
	const roots = [
		join(stateRoot, ".pi", "npm", "node_modules", packageName),
		join(stateRoot, "node_modules", packageName),
	];
	for (const root of roots) {
		if (existsSync(root)) {
			return resolveLocalPackageEntry(root);
		}
	}
	return null;
}

function resolveGitSpecifier(specifier: string, stateRoot: string): string {
	const raw = specifier.slice(4).trim();
	if (!raw) return specifier;

	const gitRoot = join(stateRoot, ".pi", "git");
	const candidates: string[] = [];

	try {
		if (/^https?:\/\//i.test(raw)) {
			const parsed = new URL(raw);
			const host = parsed.hostname;
			const pathname = parsed.pathname.replace(/^\/+/, "").replace(/\.git$/i, "");
			if (host && pathname) candidates.push(join(gitRoot, host, pathname));
		}
	} catch {
		// Fall through to other candidate formats.
	}

	const sshMatch = raw.match(/^git@([^:]+):(.+)$/i);
	if (sshMatch) {
		const host = sshMatch[1];
		const repoPath = sshMatch[2].replace(/\.git$/i, "");
		if (host && repoPath) candidates.push(join(gitRoot, host, repoPath));
	}

	const cleanedRaw = raw.replace(/\.git$/i, "").replace(/^\/+/, "");
	if (cleanedRaw) {
		candidates.push(join(gitRoot, cleanedRaw));
		const slashCount = cleanedRaw.split("/").filter(Boolean).length;
		if (slashCount === 2) {
			candidates.push(join(gitRoot, "github.com", cleanedRaw));
		}
	}

	const leaf = basename(cleanedRaw || raw).replace(/\.git$/i, "");
	if (leaf) {
		candidates.push(join(gitRoot, leaf));
	}

	const uniqueCandidates = [...new Set(candidates)];
	for (const candidate of uniqueCandidates) {
		if (existsSync(candidate)) return candidate;
	}

	return specifier;
}

export function resolveSettingsPackageSpecifier(specifier: string, stateRoot: string): string {
	const value = String(specifier || "").trim();
	if (!value) return "";

	if (isAbsolute(value)) {
		return existsSync(value) ? resolve(value) : value;
	}

	if (value.startsWith("./") || value.startsWith("../")) {
		const resolvedPath = resolve(stateRoot, value);
		return existsSync(resolvedPath) ? resolvedPath : value;
	}

	if (value.startsWith("npm:")) {
		const packageName = value.slice(4).trim();
		if (!packageName) return value;
		const local = resolveLocalNpmPackage(packageName, stateRoot);
		return local ?? packageName;
	}

	if (value.startsWith("git:")) {
		return resolveGitSpecifier(value, stateRoot);
	}

	const localBare = resolveLocalNpmPackage(value, stateRoot);
	if (localBare) return localBare;

	return value;
}

export function resolvePiSettingsPackages(stateRoot: string, excluded?: string[] | null): string[] {
	const filtered = filterExcludedExtensions(loadPiSettingsPackages(stateRoot), excluded);
	const resolved = filtered
		.map((pkg) => resolveSettingsPackageSpecifier(pkg, stateRoot))
		.map((pkg) => pkg.trim())
		.filter((pkg) => pkg.length > 0);
	return [...new Set(resolved)];
}

/**
 * Filter package specifiers by an exact-match exclusion list.
 *
 * @param packages - Package specifiers resolved from settings
 * @param excluded - Exact package specifiers to exclude
 * @returns Filtered package specifiers
 */
export function filterExcludedExtensions(
	packages: string[] | null | undefined,
	excluded: string[] | null | undefined,
): string[] {
	if (!Array.isArray(packages) || packages.length === 0) {
		return [];
	}

	if (!Array.isArray(excluded) || excluded.length === 0) {
		return [...packages];
	}

	const excludedSet = new Set(
		excluded
			.filter((pkg): pkg is string => typeof pkg === "string")
			.map((pkg) => pkg.trim())
			.filter((pkg) => pkg.length > 0),
	);

	if (excludedSet.size === 0) {
		return [...packages];
	}

	return packages.filter((pkg) => !excludedSet.has(pkg));
}
