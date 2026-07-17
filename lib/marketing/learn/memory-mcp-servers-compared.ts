import type { Article } from "./types";

export const memoryMcpServersCompared: Article = {
  slug: "memory-mcp-servers-compared",
  title:
    "Memory MCP servers compared: mem0, OpenMemory, Zep, Basic Memory, and Creedom",
  description:
    "A fair comparison of memory MCP servers. mem0, Zep, and OpenMemory are developer agent-memory infrastructure. Basic Memory and Creedom are user-owned profiles. Here is the split.",
  cluster: "comparison",
  datePublished: "2026-07-07",
  dateModified: "2026-07-07",
  lead:
    "The tools people call memory MCP servers fall into two categories that answer different questions. The first is developer infrastructure for agent memory: mem0, Zep, and OpenMemory give applications a store that captures, retrieves, and ranks facts across sessions. These are strong tools for teams building agents, where memory is a backend concern managed in code. The second is the user-owned profile: Basic Memory and Creedom keep a human-readable record you own and edit, meant to describe a person rather than power an application.\n\nThe distinction matters more than any feature list. If you are building an agent product and need programmatic memory with recall and scoring, developer infrastructure like mem0 or Zep is the right layer. If you are a person who wants one legible profile every tool reads before it answers, a user-owned context file is the right layer.\n\nCreed sits firmly on the user-profile side. It is one structured Markdown profile you own that every AI you connect reads first, connected over MCP, with agents proposing updates you approve. This guide compares the category honestly so you can pick the layer you actually need.",
  body: [
    { type: "h2", text: "The category split" },
    {
      type: "p",
      text: "Almost every confusion about memory MCP servers comes from treating one category as if it were the other. They are not competitors so much as different layers of the stack.",
    },
    {
      type: "p",
      text: "Developer agent-memory infrastructure is built for applications. mem0, Zep, and OpenMemory provide a memory store that an agent writes to and reads from as it runs: extracting facts from conversations, embedding and indexing them, and retrieving the relevant ones at inference time. The consumer is code, and the value is recall quality, latency, and scale. mem0 is developer infrastructure for agent memory; Zep is a memory layer for AI applications with strong retrieval; OpenMemory offers a self-hostable memory store agents can use. If you are shipping an agent, this is the layer you are shopping for.",
    },
    {
      type: "p",
      text: "A user-owned profile is built for a person. Basic Memory keeps human-readable Markdown notes you own and connects them to agents over MCP. Creedom keeps one structured profile about you that every tool reads before it answers. The consumer is you and the AIs you use directly, and the value is legibility, ownership, and portability. If you want AI that already knows you across tools, this is the layer.",
    },
    { type: "h2", text: "The comparison" },
    {
      type: "table",
      caption:
        "Memory MCP servers across the dimensions that actually separate them. Pricing is described generally for the developer tools because their plans change; Creedom's prices are its current published plans.",
      headers: [
        "",
        "mem0",
        "Zep",
        "OpenMemory",
        "Basic Memory",
        "Creedom",
      ],
      rows: [
        [
          "Category",
          "Agent-memory infra",
          "Agent-memory infra",
          "Agent-memory infra",
          "User-owned profile",
          "User-owned profile",
        ],
        [
          "Storage model",
          "Managed vector and graph store",
          "Retrieval-focused memory layer",
          "Self-hostable memory store",
          "Human-readable Markdown notes",
          "One structured Markdown profile",
        ],
        [
          "Who owns the data",
          "The app you build",
          "The app you build",
          "You, if self-hosted",
          "You",
          "You",
        ],
        [
          "Human-readable?",
          "Not primarily",
          "Not primarily",
          "Not primarily",
          "Yes",
          "Yes",
        ],
        [
          "Portable across tools?",
          "Via your code",
          "Via your code",
          "Via your code",
          "Yes, over MCP",
          "Yes, over MCP",
        ],
        [
          "Best for",
          "Building agent products",
          "Agent apps needing recall",
          "Self-hosted agent memory",
          "Personal Markdown knowledge",
          "One profile every AI reads",
        ],
        [
          "Rough pricing model",
          "Usage-based dev plans, self-host option",
          "Usage-based dev plans",
          "Open source, self-host",
          "Open source, self-host",
          "Free self-host; Personal $12/mo, $99/yr, $199 lifetime; Company $129/mo, $999/yr, $1,999 lifetime",
        ],
      ],
    },
    { type: "h2", text: "When to choose developer infrastructure" },
    {
      type: "p",
      text: "If you are building an agent or an AI product, mem0, Zep, and OpenMemory are the right kind of tool and each is strong. They give your application a memory backend so it can remember users across sessions, retrieve the right facts at the right moment, and scale that behavior in production. This is real engineering value that a personal profile does not provide, and it is not the job Creedom is built for.",
    },
    {
      type: "ul",
      items: [
        "mem0: developer infrastructure for agent memory, with managed and self-hosted paths.",
        "Zep: a memory layer for AI applications, focused on retrieval quality.",
        "OpenMemory: a self-hostable memory store agents can read and write.",
      ],
    },
    {
      type: "p",
      text: "Because their pricing is usage-based and changes over time, treat plan details as something to check on their sites rather than a fixed number. The durable fact is the category: these are backends for the agents you build.",
    },
    { type: "h2", text: "When to choose a user-owned profile" },
    {
      type: "p",
      text: "If you are a person who uses AI across several tools and wants each one to start already knowing you, choose the profile layer. Basic Memory and Creedom both keep human-readable data you own and connect it to agents over MCP. The difference is emphasis: Basic Memory is a general Markdown knowledge base, while Creedom is a focused profile about you, structured into sections and kept current by agent proposals you approve.",
    },
    {
      type: "p",
      text: "Creedom keeps one profile with five always-on core sections, Identity, Goals, Work, Preferences, and Routines, plus optional Beliefs, Constraints, People, Health, and Context. Every agent you connect over MCP reads it before answering, then proposes narrow updates you approve, or edits directly if you trust it to. It is plain Markdown you own with BYOK, export, and delete, and it integrates with GitHub for version control. Self-hosting is free; the hosted Personal plan is $12/mo, $99/yr, or $199 lifetime, and the Company plan adds one shared Company Creedom for a team at $129/mo, $999/yr, or $1,999 lifetime.",
    },
    { type: "h2", text: "The short version" },
    {
      type: "p",
      text: "mem0, Zep, and OpenMemory are memory for the agents you build. Basic Memory and Creedom are memory about you that you own and every tool reads. Pick by which side of that line your problem is on. If you want an application backend, start with the developer infrastructure. If you want AI that knows you across ChatGPT, Claude, and Cursor, start with a user-owned context file.",
    },
  ],
  faq: [
    {
      question: "Is mem0 or Creedom better?",
      answer:
        "They solve different problems. mem0 is developer infrastructure for giving the agents you build a memory backend. Creedom is a user-owned profile that every AI you connect reads before it answers. Choose mem0 if you are building an agent, and Creedom if you want AI that knows you across tools.",
    },
    {
      question: "What is the difference between agent memory and a context file?",
      answer:
        "Agent memory is a backend that an application reads and writes in code to remember its users. A context file is a human-readable profile about you that you own and edit, which tools read directly. One serves the app you build; the other serves you.",
    },
    {
      question: "Are these memory MCP servers open source?",
      answer:
        "Several offer self-hosting or open-source paths, including OpenMemory, Basic Memory, and Creedom. mem0 and Zep offer usage-based hosted plans alongside developer options. Check each project for current details, since plans change over time.",
    },
    {
      question: "Can I use a developer memory tool and Creedom together?",
      answer:
        "Yes, and they do not conflict. You might build an agent on mem0 or Zep while also maintaining a Creedom profile that describes you for the tools you use directly. They live at different layers of the stack.",
    },
    {
      question: "How much does Creedom cost?",
      answer:
        "Self-hosting is free. The hosted Personal plan is $12/mo, $99/yr, or $199 lifetime, and the Company plan is $129/mo, $999/yr, or $1,999 lifetime with 10 seats included. BYOK is available.",
    },
  ],
  related: [
    { label: "Creedom vs mem0", href: "/learn/creed-vs-mem0" },
    { label: "Browser extension vs MCP context", href: "/learn/browser-extension-vs-mcp-context" },
    { label: "What is a personal context file", href: "/learn/what-is-a-personal-context-file" },
    { label: "Creedom pricing", href: "/pricing" },
  ],
};
