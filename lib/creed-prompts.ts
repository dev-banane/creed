// The MCP prompts Creed exposes (prompts/list + prompts/get) and the in-app
// "copy prompt" buttons share this one source of truth, so the text a user
// pastes into their agent is always identical to what the MCP client lists.
export const CREED_PROMPTS = [
  {
    name: "introduce-me",
    description: "Read my Creed and introduce me the way a sharp collaborator would.",
    text: "Read my Creed with read_creed, then introduce me in a few tight sentences the way a sharp new collaborator would after reading my profile. Lead with what matters most about how to work with me.",
  },
  {
    name: "tighten-my-creed",
    description: "Review my Creed and propose tightening or pruning where it has drifted.",
    text: "Read my Creed with read_creed, then look for anything vague, stale, duplicated, or contradictory. Propose narrowly-scoped tightening or pruning with the creed_* tools, following the contract. If nothing durable needs changing, say so and propose nothing.",
  },
  {
    name: "compose-my-creed",
    description: "Compose my full Creed from the onboarding draft and what you know about me.",
    text: "I just finished onboarding. Read my current Creed with read_creed first - it has a starter draft, and if I'm using more than one agent it may already have sections another agent wrote. Then compose a sharp, durable profile of me: combine what you already know about me from our history with my onboarding draft and whatever is already in the Creed, kept concise and concrete with no filler, following the curation contract. Call compose_creed once with every section to write the whole Creed in a single step - keep each section's sectionId from read_creed and put the rewritten body in contentMarkdown. compose_creed writes directly and does not need approval, so use it for this initial build rather than the propose or per-section tools. This is the initial build of my Creed.",
  },
] as const;

export type CreedPromptName = (typeof CREED_PROMPTS)[number]["name"];

export function getCreedPromptText(name: CreedPromptName): string {
  return CREED_PROMPTS.find((prompt) => prompt.name === name)?.text ?? "";
}
