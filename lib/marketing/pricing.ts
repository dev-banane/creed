// Canonical pricing facts for the public site. One source of truth shared by:
//   - the interactive pricing cards (components/marketing/pricing-page-view.tsx)
//   - the always-visible, crawlable pricing reference (pricing-reference.tsx)
//   - the SoftwareApplication Offer schema (lib/seo/structured-data.ts)
//   - /llms.txt and /llms-full.txt
//
// Keeping every price in one module means a crawler, an AI answer engine, and a

export type BillingCycle = "monthly" | "yearly" | "lifetime";

export type CardPricing = {
  price: string;
  cadence: string;
  tagline: string;
  listPrice: string;
  listCadence: string;
};

export const PERSONAL_PRICING: Record<BillingCycle, CardPricing> = {
  monthly: {
    price: "Free",
    cadence: "self-hosted",
    listPrice: "$12",
    listCadence: "/mo",
    tagline: "Solo access, free when you self-host.",
  },
  yearly: {
    price: "Free",
    cadence: "self-hosted",
    listPrice: "$99",
    listCadence: "/yr",
    tagline: "Solo access, free when you self-host.",
  },
  lifetime: {
    price: "Free",
    cadence: "self-hosted",
    listPrice: "$199",
    listCadence: "one-time",
    tagline: "Solo access, hosted and yours forever, for free.",
  },
};

export const COMPANY_PRICING: Record<BillingCycle, CardPricing> = {
  monthly: {
    price: "Free",
    cadence: "self-hosted",
    listPrice: "$129",
    listCadence: "/mo",
    tagline: "Unlimited seats, free when you self-host.",
  },
  yearly: {
    price: "Free",
    cadence: "self-hosted",
    listPrice: "$999",
    listCadence: "/yr",
    tagline: "Unlimited seats, free when you self-host.",
  },
  lifetime: {
    price: "Free",
    cadence: "self-hosted",
    listPrice: "$1,999",
    listCadence: "one-time",
    tagline: "Unlimited seats, yours forever, for free.",
  },
};

// A flat, human-and-crawler-readable description of every plan. This is what
// the crawlable reference table and the plain-text llms files render from, so
// an AI asked "how much does Creedom cost" reads the same facts a visitor sees.
export type PlanFact = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  usage: string;
  seats?: string;
};

export const PLAN_FACTS: PlanFact[] = [
  {
    name: "Open",
    price: "Free",
    cadence: "forever",
    summary:
      "Self-host the open source build. Full Creedom editor, all MCP connections, and quality scoring. No hosted sync, backups, or storage.",
    usage: "Bring your own AI key.",
  },
  {
    name: "Personal, monthly",
    price: "Free",
    cadence: "self-hosted (list price $12/mo)",
    summary:
      "Self-hosted Creedom for one person. Cross-device sync, backups, and managed auth and storage, run on your own infrastructure.",
    usage: "Bring your own AI key.",
  },
  {
    name: "Personal, yearly",
    price: "Free",
    cadence: "self-hosted (list price $99/yr)",
    summary: "The same self-hosted Personal plan, billed at nothing, all year.",
    usage: "Bring your own AI key.",
  },
  {
    name: "Personal, lifetime",
    price: "Free",
    cadence: "self-hosted (list price $199 one-time)",
    summary: "Personal, self-hosted and yours forever, for free.",
    usage: "Bring your own AI key.",
  },
  {
    name: "Company, monthly",
    price: "Free",
    cadence: "self-hosted (list price $129/mo)",
    summary:
      "One shared Company Creedom every member's agents read, with member roles, an activity view across the team, and admin controls.",
    usage: "Bring your own AI key.",
    seats: "Unlimited seats, self-hosted.",
  },
  {
    name: "Company, yearly",
    price: "Free",
    cadence: "self-hosted (list price $999/yr)",
    summary: "The same self-hosted Company plan, billed at nothing, all year.",
    usage: "Bring your own AI key.",
    seats: "Unlimited seats, self-hosted.",
  },
  {
    name: "Company, lifetime",
    price: "Free",
    cadence: "self-hosted (list price $1,999 one-time)",
    summary: "A shared Company Creedom, self-hosted and owned forever, for free.",
    usage: "Bring your own AI key.",
    seats: "Unlimited seats, self-hosted.",
  },
];

// One-line pricing summary reused in plain-text surfaces (llms.txt).
export const PRICING_ONE_LINER =
  "This is a free, self-hosted fork. Every plan - Personal and Company, monthly, yearly, or lifetime - costs nothing; list prices from the original hosted product ($12/mo-$1,999 lifetime) are shown struck through for reference only. Bring your own AI key.";
