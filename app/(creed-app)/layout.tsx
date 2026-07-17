import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShellLayout } from "@/components/creed/app-shell-layout";
import { AppVersionNotifier } from "@/components/creed/app-version-notifier";
import { getAppVersion } from "@/lib/app-version";
import { AuthedProviders } from "@/components/creed/authed-providers";
import { hasPersistedCreed } from "@/lib/creed-backend";
import { isSupabaseTableMissingError } from "@/lib/creed-backend-errors";
import { hasCompanyAccess } from "@/lib/creed-membership";
import { resolveActiveCreed } from "@/lib/creed-context";
import { getRequestAuth } from "@/lib/request-auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

//
//
// Marketing routes and /payment/* don't pass through here so they remain
//
// This layout (not the root) owns the dynamic, user-specific boundary now:
// AuthedProviders loads the Creed and supplies CreedProvider, and the gate
// reads the session, so the segment renders dynamically while the root stays
// static.
export const dynamic = "force-dynamic";

export default async function CreedAppLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    // Local dev without Supabase config: skip the gate so the rest of
    // the app can render. Production deployments always have Supabase.
    return (
      <AuthedProviders>
        <AppShellLayout showWelcome={false} welcomePaidAt={null}>
          {children}
        </AppShellLayout>
        <AppVersionNotifier initialVersion={getAppVersion()} />
      </AuthedProviders>
    );
  }

  const { supabase, user } = await getRequestAuth();

  if (!user) {
    redirect("/login");
  }

  const companyAccess = await hasCompanyAccess(supabase, user.id);

  if (!companyAccess) {
    let sectionsPersisted = false;
    try {
      sectionsPersisted = await hasPersistedCreed(supabase, user.id);
    } catch (error) {
      if (!isSupabaseTableMissingError(error)) {
        throw error;
      }
    }
    if (!sectionsPersisted) {
      redirect("/onboarding");
    }
  }

  // Resume company onboarding: if the user OWNS any company Creed that has not
  // finished setup, send them to the company onboarding flow rather than an
  // empty file. This is the "bought it, closed the laptop, came back" path - the
  // switcher's "Set up" entry lands here too. Scan every Creed, not just the
  // active one: a dual-Creed owner whose active cookie points at their personal
  // Creed (the resolveActiveCreed default) must still be resumed into setup.
  const active = await resolveActiveCreed(supabase, user);
  if (active) {
    const unfinishedOwned = active.creeds.find(
      (c) => c.type === "company" && c.needsSetup && c.role === "owner"
    );
    if (unfinishedOwned) {
      redirect("/onboarding/company");
    }
  }

  return (
    <AuthedProviders>
      <AppShellLayout showWelcome={false} welcomePaidAt={null}>
        {children}
      </AppShellLayout>
      <AppVersionNotifier initialVersion={getAppVersion()} />
    </AuthedProviders>
  );
}
