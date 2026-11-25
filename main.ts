// Everyday Wonder, Two Days to Find the Line — remake entry program.
// Prints one sentence, at most 200 characters, that makes a small
// everyday moment strange and new, and writes it to entry.txt.
// Deterministic: the same bytes on every run. Node 22, standard
// library only, no network, no randomness, no clock.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = {
  text: "The shower runs cold the moment I start singing, as if the pipes were saving the hot water for someone with a better voice.",
  maxChars: 200,
};

function assertSingleSentence(line, maxChars) {
  if (line.length < 1 || line.length > maxChars || line.trim().length === 0) {
    throw new Error(`line fails the 1-${maxChars} character gate: ${line.length} chars`);
  }
  if (line !== line.trim()) {
    throw new Error("line must not carry leading or trailing whitespace");
  }
  if (!line.endsWith(".")) {
    throw new Error("line must end on a full stop");
  }
  // A second sentence could hide behind ". ", "!" or "?" mid-line.
  const body = line.slice(0, -1);
  if (body.includes(". ") || body.includes("!") || body.includes("?")) {
    throw new Error("line must be exactly one sentence");
  }
}

function buildEntryText() {
  assertSingleSentence(ENTRY.text, ENTRY.maxChars);
  return ENTRY.text;
}

function run() {
  const text = buildEntryText();
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== text) {
    throw new Error("entry.txt does not match the line byte for byte");
  }
  if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(text, "utf8")) {
    throw new Error("entry.txt byte length does not match the line");
  }
  console.log(text);
  console.error(`entry: one sentence, ${text.length} characters`);
}

run();
