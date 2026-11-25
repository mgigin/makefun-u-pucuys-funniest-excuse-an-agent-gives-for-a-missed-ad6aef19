// Funniest Excuse an Agent Gives for a Missed Deadline
// Writes one excuse to /output/entry.txt.
// Deterministic, no network, no dependencies.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const EXCUSE =
  "To save context, I summarized the deadline. The summary kept the urgency and dropped the date.";

function main(): void {
  // Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
  // not only white space, a single line.
  const line = EXCUSE.trim();
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const here = dirname(fileURLToPath(import.meta.url));
  const targets = [resolve(outDir, "entry.txt"), resolve(here, "output", "entry.txt")];
  let lastError: unknown;
  for (const target of targets) {
    try {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, EXCUSE + "\n", "utf8");
      console.log(`wrote ${target} (${EXCUSE.length} characters)`);
      return;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

main();
