import { NextResponse } from "next/server";
import type { CreedSection } from "@/lib/creed-data";
import {
  findUserIdByDirectEditToken,
  loadCreedState,
  persistCreedState,
} from "@/lib/creed-backend";
import { checkRateLimit } from "@/lib/rate-limit";
import { normalizeRichTextInput } from "@/lib/rich-text";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";

// One-time initial build of a freshly-onboarded Creed. The user's connected
// agent composes the whole profile and writes it back here in a single call -
// the agent-composed onboarding replacement for the old OpenRouter generate
// step. This is an INITIALIZE, not an edit, so it bypasses the per-section
// "direct" gate that /api/creed/write enforces. It is safe because it only runs
// while the Creed is still the pristine deterministic draft (no section has
// been agent-authored yet); a later call is rejected so it can never wipe real
// edits. Authenticated by the direct-edit token, like the write route.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ComposeBody = {
  sections?: Array<{ sectionId?: string; contentMarkdown?: string }>;
  agentName?: string;
  integration?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "server_error" }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  if (!token) {
    return NextResponse.json(
      { error: "Missing write token. Send via Authorization: Bearer <token>." },
      { status: 401 }
    );
  }

  const verdict = checkRateLimit({
    scope: "creed-compose",
    identifier: token,
    limit: 10,
    windowMs: 60_000,
  });
  if (!verdict.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(verdict.retryAfterSeconds) } }
    );
  }

  const admin = getSupabaseAdminClient();
  const userId = await findUserIdByDirectEditToken(admin as never, token);
  if (!userId) {
    return NextResponse.json({ error: "Invalid write token." }, { status: 401 });
  }

  const { data: userData, error: userError } = await admin.auth.admin.getUserById(userId);
  if (userError || !userData.user) {
    return NextResponse.json(
      { error: userError?.message ?? "Could not load token owner." },
      { status: 500 }
    );
  }

  const result = await loadCreedState(admin as never, userData.user, {
    proposalLimit: 1,
    activityLimit: 1,
  });

  if (result.state.sections.length === 0) {
    return NextResponse.json(
      { error: "No Creed to compose yet. The user must finish onboarding first." },
      { status: 409 }
    );
  }

  // Initial-build window: only the pristine deterministic draft can be composed.
  // Once any section has been agent-authored the Creed is live, and ongoing
  // changes must go through the per-section propose / direct path instead.
  if (result.state.sections.some((section) => section.lastEditedType === "agent")) {
    return NextResponse.json(
      {
        error:
          "This Creed has already been composed. Use the creed_* tools to propose ongoing edits.",
      },
      { status: 409 }
    );
  }

  const body = (await request.json().catch(() => null)) as ComposeBody | null;
  if (!body || !Array.isArray(body.sections) || body.sections.length === 0) {
    return NextResponse.json({ error: "Missing composed sections." }, { status: 400 });
  }

  const agentName =
    typeof body.agentName === "string" && body.agentName.trim() ? body.agentName.trim() : "Agent";

  // Map the composed bodies onto the draft sections by id. Keeping the draft's
  // spine (ids, names, accents, templates, and the propose permission) means we
  // upgrade the content without the agent having to reason about structure or
  // accent keys; new/removed sections happen later through proposals.
  const composedById = new Map<string, string>();
  for (const entry of body.sections) {
    if (typeof entry?.sectionId !== "string") continue;
    const content = normalizeRichTextInput({ contentMarkdown: entry.contentMarkdown });
    if (content) {
      composedById.set(entry.sectionId, content);
    }
  }
  if (composedById.size === 0) {
    return NextResponse.json({ error: "No usable composed content." }, { status: 400 });
  }

  let updated = 0;
  const nextSections: CreedSection[] = result.state.sections.map((section) => {
    const content = composedById.get(section.id);
    if (!content || content === section.content) {
      return section;
    }
    updated += 1;
    return {
      ...section,
      content,
      // agentPermission stays "propose" (the garden) - ongoing edits need
      // approval; the compose itself is the one allowed direct initialize.
      lastEditedBy: agentName,
      lastEditedType: "agent" as const,
      lastEditedLabel: "just now",
    };
  });

  if (updated === 0) {
    return NextResponse.json({ ok: true, updated: 0 });
  }

  const nextState = {
    ...result.state,
    syncLabel: "Saved just now",
    sections: nextSections,
    proposals: [],
    mutationTick: result.state.mutationTick + 1,
  };

  await persistCreedState(admin as never, userId, nextState);

  return NextResponse.json({ ok: true, updated });
}
