import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { reviewCompanyProposal } from "@/lib/company-sections";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/app/proposals/[id] { creedId, decision: "accept" | "reject" | "withdraw" }
// Company proposal review. Owner/admin may review any; a member may review only
// sections where they hold Direct edit. "withdraw" lets the proposal's own
// author delete their pending proposal (all enforced in the lib).
export async function POST(request: Request, ctx: Ctx) {
  const auth = await requireApiAuth();
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const b = (body ?? {}) as { creedId?: unknown; decision?: unknown };
  if (
    typeof b.creedId !== "string" ||
    (b.decision !== "accept" &&
      b.decision !== "reject" &&
      b.decision !== "withdraw")
  ) {
    return NextResponse.json(
      { error: "creedId and decision are required." },
      { status: 400 },
    );
  }

  const result = await reviewCompanyProposal({
    creedId: b.creedId,
    user: auth.user,
    proposalId: id,
    decision: b.decision,
  });
  if (!result.ok) {
    const status =
      result.code === "forbidden" || result.code === "frozen"
        ? 403
        : result.code === "not_found"
          ? 404
          : 400;
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status },
    );
  }
  return NextResponse.json(result);
}
