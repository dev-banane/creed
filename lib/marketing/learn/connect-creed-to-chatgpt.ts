import type { Article } from "./types";

export const connectCreedToChatgpt: Article = {
  slug: "connect-creed-to-chatgpt",
  title: "Connect Creedom to ChatGPT",
  description:
    "Add Creedom to ChatGPT as a custom MCP connector, authorize with OAuth, and ChatGPT reads your context before it answers. Here are the exact steps and how to verify.",
  cluster: "integration",
  datePublished: "2026-07-07",
  dateModified: "2026-07-07",
  lead:
    "To connect Creedom to ChatGPT, add it as a custom remote MCP connector in ChatGPT's settings, then authorize it once with OAuth. Open Settings, go to Connectors, add a custom or remote MCP server using the URL https://creed.md/mcp, and authorize by clicking Allow on the Creedom consent screen while signed in to creed.md. There is no key to paste; the whole handshake is OAuth.\n\nOnce connected, ChatGPT can read your Creedom profile before it answers, so it starts already knowing your identity, goals, work, and preferences instead of asking you to re-explain them. As it learns something durable about you, it can propose a narrow update you approve.\n\nCreed is one personal context file that every AI reads before it answers. Connector availability in ChatGPT depends on your plan and the current rollout, so the exact menu wording may differ. The setup shape is the same: add the remote MCP server, authorize, and verify by calling read_creed once.",
  body: [
    { type: "h2", text: "Before you start" },
    {
      type: "p",
      text: "Custom and remote MCP connectors in ChatGPT are gated by plan and rollout, so where the option lives can vary. In general terms, look under Settings for a Connectors area that lets you add a custom or remote MCP server. If you do not see it, your plan or the current rollout may not expose it yet.",
    },
    { type: "h2", text: "Step by step" },
    {
      type: "ol",
      items: [
        "Open ChatGPT Settings.",
        "Go to Connectors.",
        "Choose to add a custom or remote MCP server.",
        "Enter the Creedom server URL: https://creed.md/mcp",
        "Save, then start the authorization when prompted.",
        "A browser step opens the Creedom consent screen; sign in to creed.md if needed.",
        "Click Allow to grant ChatGPT access to your Creedom.",
      ],
    },
    {
      type: "p",
      text: "The URL is the one detail that matters most. Use the Creedom MCP endpoint exactly:",
    },
    {
      type: "code",
      lang: "text",
      code: "https://creed.md/mcp",
    },
    { type: "h2", text: "Authorizing with OAuth" },
    {
      type: "p",
      text: "Creedom MCP uses OAuth, so there is nothing to copy. When you authorize, you are taken to the Creedom consent screen. Make sure you are signed in to creed.md, then click Allow. That grant is what lets ChatGPT read your profile; you do not create or paste any token.",
    },
    { type: "h2", text: "Verify the connection" },
    {
      type: "p",
      text: "Confirm ChatGPT can reach Creedom before you rely on it.",
    },
    {
      type: "ul",
      items: [
        "Check that the Creedom connector appears as connected in your Connectors list.",
        "In a chat, confirm the Creedom tools are available and have ChatGPT call read_creed once.",
        "Check that your profile sections come back, which confirms the read path works.",
      ],
    },
    { type: "h2", text: "How ChatGPT uses your profile" },
    {
      type: "p",
      text: "With Creedom connected, ChatGPT can read your profile before it answers rather than starting cold. It uses your Identity, Goals, Work, Preferences, and Routines to shape replies, so you stop re-explaining who you are. When it learns something durable, it can propose a narrow update to the relevant section, which you approve.",
    },
    {
      type: "p",
      text: "Updates flow through the creed_* tools and are scoped to specific sections, not wholesale rewrites. Whether an edit applies directly or arrives as a proposal depends on your write policy, which an agent can check with get_write_policy before changing anything.",
    },
    { type: "h2", text: "One profile across tools" },
    {
      type: "p",
      text: "The point of connecting Creedom to ChatGPT is consistency. The profile ChatGPT reads is the same one your other connected agents read, so your context does not fork per tool. It is plain Markdown you own, with export and delete anytime and no lock-in.",
    },
  ],
  faq: [
    {
      question: "How do I add Creedom to ChatGPT?",
      answer:
        "Open ChatGPT Settings, go to Connectors, add a custom or remote MCP server using the URL https://creed.md/mcp, then authorize by clicking Allow on the Creedom consent screen while signed in to creed.md.",
    },
    {
      question: "Do I need a special ChatGPT plan?",
      answer:
        "Custom and remote MCP connector availability depends on your plan and the current rollout. If you do not see the option to add a custom MCP server under Connectors, your plan or the rollout may not expose it yet.",
    },
    {
      question: "Is there a token to copy for Creedom?",
      answer:
        "No. Creedom MCP uses OAuth. You authorize through the Creedom consent screen by clicking Allow, and there is nothing to paste.",
    },
    {
      question: "How do I confirm ChatGPT can read my Creedom?",
      answer:
        "Check that the Creedom connector shows as connected, then have ChatGPT call read_creed once. If your profile sections come back, the connection works.",
    },
  ],
  related: [
    { label: "Connect Creedom to Claude Code", href: "/learn/connect-creed-to-claude-code" },
    { label: "Connect Creedom to Cursor", href: "/learn/connect-creed-to-cursor" },
    { label: "Share context between ChatGPT and Claude", href: "/learn/share-context-between-chatgpt-and-claude" },
    { label: "Read the docs", href: "/docs" },
  ],
};
