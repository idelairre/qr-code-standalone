#!/usr/bin/env node

/**
 * Runs gh-pages against dist/. If Git hits a corrupt loose object in the
 * gh-pages module cache (under node_modules/.cache/gh-pages), clears that
 * cache and retries once — same recovery as a manual cache delete.
 */

import { spawnSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { join } from "path";
import { logError, logWarning, PROJECT_ROOT } from "./utils.js";

const GH_PAGES_CACHE_DIR = join(PROJECT_ROOT, "node_modules", ".cache", "gh-pages");
const GH_PAGES_CLI = join(PROJECT_ROOT, "node_modules", "gh-pages", "bin", "gh-pages.js");

function combinedOutput(result) {
   return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

function looksLikeCorruptGhPagesCache(output) {
   return (
      /corrupt loose object/i.test(output) ||
      (/inflate:\s*data stream error/i.test(output) && /incorrect data check/i.test(output))
   );
}

function clearGhPagesCache() {
   if (!existsSync(GH_PAGES_CACHE_DIR)) {
      return false;
   }
   rmSync(GH_PAGES_CACHE_DIR, { recursive: true, force: true });
   return true;
}

function runGhPages() {
   if (!existsSync(GH_PAGES_CLI)) {
      logError("gh-pages CLI not found. Run install from the project root.");
      process.exit(1);
   }

   return spawnSync(process.execPath, [GH_PAGES_CLI, "-d", "dist"], {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
      stdio: ["inherit", "pipe", "pipe"],
   });
}

function emitStreams(result) {
   if (result.stdout) {
      process.stdout.write(result.stdout);
   }
   if (result.stderr) {
      process.stderr.write(result.stderr);
   }
}

let result = runGhPages();
emitStreams(result);

if (result.status === 0) {
   process.exit(0);
}

const firstOutput = combinedOutput(result);
if (looksLikeCorruptGhPagesCache(firstOutput) && clearGhPagesCache()) {
   logWarning("gh-pages cache looked corrupt; removed cache and retrying publish once.");
   result = runGhPages();
   emitStreams(result);
   process.exit(result.status ?? 1);
}

process.exit(result.status ?? 1);
