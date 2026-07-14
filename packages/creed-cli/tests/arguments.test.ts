import assert from "node:assert/strict";
import test from "node:test";
import { parseToolArguments, shellSplit } from "../src/commands/arguments.js";

const schema = {
  type: "object",
  properties: {
    sectionId: { type: "string" },
    limit: { type: "integer", minimum: 1, maximum: 25 },
    enabled: { type: "boolean" },
  },
  required: ["sectionId"],
};

test("converts kebab flags back to live MCP property names", async () => {
  assert.deepEqual(
    await parseToolArguments(["--section-id", "goals", "--limit", "5", "--enabled"], schema),
    { sectionId: "goals", limit: 5, enabled: true },
  );
});

test("accepts raw JSON as the universal schema fallback", async () => {
  assert.deepEqual(
    await parseToolArguments(["--args", '{"futureShape":{"value":1}}'], schema),
    { futureShape: { value: 1 } },
  );
});

test("rejects missing required arguments", async () => {
  await assert.rejects(() => parseToolArguments([], schema), /Missing required argument: sectionId/);
});

test("splits quoted interactive commands without evaluating shell syntax", () => {
  assert.deepEqual(shellSplit('creed_search --query "pricing model"'), ["creed_search", "--query", "pricing model"]);
  assert.deepEqual(shellSplit("creed_search --query '$(whoami)'"), ["creed_search", "--query", "$(whoami)"]);
});
