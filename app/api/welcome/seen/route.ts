import { NextResponse } from "next/server";
import { NO_STORE_HEADERS } from "@/lib/http-headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

//
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not signed in" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS });
}
