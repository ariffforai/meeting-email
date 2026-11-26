// Meeting That Should Have Been an Email — v1 entry.
// Writes one single-line joke (1-200 chars, no trailing newline) to /output/entry.txt.
// Node 22+, stdlib only, fully deterministic: the line is fixed, no randomness, no clock.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "Nine people, one hour, zero decisions, but we booked a follow-up to discuss why we met.";

const OUTPUT_PATH = "/output/entry.txt";

// Gate: the entry must be one line of 1-200 characters, pure printable ASCII,
// no trailing newline, and the file on disk must read back byte-identical.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength > 200) {
  throw new Error(`entry must be at most 200 bytes, got ${byteLength}`);
}
for (let i = 0; i < LINE.length; i++) {
  const code = LINE.charCodeAt(i);
  if (code < 0x20 || code > 0x7e) {
    throw new Error(
      `entry must be pure printable ASCII, found U+${code.toString(16).padStart(4, "0")} at index ${i}`,
    );
  }
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, LINE, "utf8");

// Read-back verification: what the grader will read must match exactly.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== LINE) {
  throw new Error("read-back mismatch: /output/entry.txt does not match the entry");
}
if (Buffer.byteLength(written, "utf8") !== byteLength) {
  throw new Error("read-back mismatch: byte length changed on disk");
}
