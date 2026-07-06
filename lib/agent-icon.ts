// Maps a free-text agent / client name to one of the fixed brand icon kinds.
// Lives in lib (not the "use client" agent-icon-stack) so server components,
// like the OAuth consent screen, can resolve a connecting client's icon too.
import type { AgentIconKind } from "@/lib/creed-data";

// Order matters: the first alias whose substring is found wins. More specific
// multi-word names ("claude code") must come before their broader prefixes
// ("claude"), and broad substrings ("v0") sit last so exact names match first.
const agentAliases: Array<[AgentIconKind, string[]]> = [
  ["claudecode", ["claude code", "claude-code", "claude_code", "claudecode"]],
  ["chatgpt", ["chatgpt", "chat gpt", "chat-gpt"]],
  ["claude", ["claude"]],
  ["codex", ["codex", "creed"]],
  ["cursor", ["cursor"]],
  ["replit", ["replit"]],
  ["devin", ["devin"]],
  ["whirl", ["whirl"]],
  ["grok", ["grok"]],
  ["opencode", ["opencode", "open code", "open-code"]],
  ["openclaw", ["openclaw", "open claw", "open-claw", "clawdius", "claw"]],
  ["hermes", ["hermes"]],
  ["v0", ["v0"]],
];

function normalizeAgentName(value?: string | null) {
  const normalized = value?.toLowerCase().trim() ?? "";
  // Company attribution renders as "[member]'s [agent]". Icon detection should
  // inspect the actual agent suffix, so "Connor's Codex" and "Connor's Creed"
  // do not fall back to the generic custom-agent glyph.
  return normalized.replace(/^.+?'s\s+/, "");
}

export function getAgentIconKind(value?: string | null): AgentIconKind {
  const normalized = normalizeAgentName(value);
  const match = agentAliases.find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  );

  return match?.[0] ?? "custom";
}
