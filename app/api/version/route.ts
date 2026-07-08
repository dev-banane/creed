import { NextResponse } from "next/server";
import { getAppVersion } from "@/lib/app-version";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
} as const;

export async function GET() {
  return NextResponse.json(
    { version: getAppVersion() },
    { headers: NO_STORE_HEADERS },
  );
}
