import { readFile } from "node:fs/promises";
import { CliError } from "../errors.js";

type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
};

function camelToKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}

function parseValue(value: string, schema: JsonSchema | undefined): unknown {
  if (schema?.type === "integer") {
    const number = Number(value);
    if (!Number.isInteger(number)) throw new CliError(`Expected an integer, received ${value}.`, 2);
    if (schema.minimum !== undefined && number < schema.minimum) throw new CliError(`Value must be at least ${schema.minimum}.`, 2);
    if (schema.maximum !== undefined && number > schema.maximum) throw new CliError(`Value must be at most ${schema.maximum}.`, 2);
    return number;
  }
  if (schema?.type === "number") {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new CliError(`Expected a number, received ${value}.`, 2);
    return number;
  }
  if (schema?.type === "boolean") return value !== "false";
  if (schema?.type === "array" || schema?.type === "object") {
    try { return JSON.parse(value) as unknown; } catch { throw new CliError(`Expected JSON for ${schema.type} value.`, 2); }
  }
  if (schema?.enum && !schema.enum.includes(value)) throw new CliError(`Expected one of: ${schema.enum.join(", ")}.`, 2);
  return value;
}

export async function parseToolArguments(tokens: string[], inputSchema: unknown): Promise<Record<string, unknown>> {
  const schema = inputSchema as JsonSchema;
  const rawArgsIndex = tokens.indexOf("--args");
  if (rawArgsIndex >= 0) {
    const raw = tokens[rawArgsIndex + 1];
    if (!raw) throw new CliError("--args requires a JSON object.", 2);
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      return parsed as Record<string, unknown>;
    } catch { throw new CliError("--args must contain a JSON object.", 2); }
  }
  const fileIndex = tokens.indexOf("--file");
  if (fileIndex >= 0) {
    const path = tokens[fileIndex + 1];
    if (!path) throw new CliError("--file requires a path.", 2);
    const parsed = JSON.parse(await readFile(path, "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new CliError("The argument file must contain a JSON object.", 2);
    return parsed as Record<string, unknown>;
  }

  const byFlag = new Map<string, [string, JsonSchema]>();
  for (const [name, property] of Object.entries(schema.properties ?? {})) {
    byFlag.set(`--${camelToKebab(name)}`, [name, property]);
  }
  const result: Record<string, unknown> = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token?.startsWith("--") || token === "--json" || token === "--yes" || token === "--quiet") continue;
    const mapping = byFlag.get(token);
    if (!mapping) throw new CliError(`Unknown argument: ${token}. Use --args for raw JSON.`, 2);
    const [name, property] = mapping;
    if (property.type === "boolean") {
      result[name] = true;
      continue;
    }
    const value = tokens[index + 1];
    if (value === undefined) throw new CliError(`${token} requires a value.`, 2);
    result[name] = parseValue(value, property);
    index += 1;
  }
  const missing = (schema.required ?? []).filter((name) => result[name] === undefined);
  if (missing.length > 0) throw new CliError(`Missing required argument${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}.`, 2);
  return result;
}

export function shellSplit(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;
  for (const character of input.trim()) {
    if (escaped) { current += character; escaped = false; continue; }
    if (character === "\\" && quote !== "'") { escaped = true; continue; }
    if (quote) { if (character === quote) quote = null; else current += character; continue; }
    if (character === "'" || character === '"') { quote = character; continue; }
    if (/\s/.test(character)) { if (current) { tokens.push(current); current = ""; } continue; }
    current += character;
  }
  if (quote) throw new CliError("Unclosed quote.", 2);
  if (escaped) current += "\\";
  if (current) tokens.push(current);
  return tokens;
}
