"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreed } from "@/components/creed/creed-provider";

// The Creed switcher, rendered as the file-screen header title. Shows the active
// Creed's name ("Connor Hepburn / Creed" for personal, "Bad Company / Creed" for
// a company) with a dropdown arrow to the right. When the user belongs to only
// one Creed there is no arrow and no menu - it renders as a plain title.
const TITLE_CLASS =
  "font-heading text-[1.22rem] font-medium tracking-[-0.03em] text-[var(--creed-text-primary)] md:text-[1.45rem]";

export function CreedSwitcher() {
  const { state, switchCreed } = useCreed();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);

  const creeds = state.creeds ?? [];
  const activeId = state.creedId ?? creeds.find((c) => c.type === "personal")?.id ?? creeds[0]?.id ?? null;
  const displayName =
    state.creedType === "company" ? state.company?.creedName ?? "Company" : state.user.name;

  // One Creed (or none loaded): plain title, no dropdown.
  if (creeds.length <= 1) {
    return <div className={TITLE_CLASS}>{displayName} / Creed</div>;
  }

  async function switchTo(creed: { id: string; needsSetup?: boolean }) {
    if (creed.id === activeId && !creed.needsSetup) return;
    setSwitching(true);
    try {
      // A company that hasn't finished setup routes into the onboarding flow
      // (which owns the gate/redirect). Set the active cookie first so onboarding
      // targets the right Creed, then navigate.
      if (creed.needsSetup) {
        const response = await fetch("/api/app/creeds/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creedId: creed.id }),
        });
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as { error?: string };
          toast.error(data.error ?? "Could not switch Creed.");
          setSwitching(false);
          return;
        }
        router.push("/onboarding/company");
        return;
      }

      // Instant, client-side swap: replaces provider state wholesale, no full
      // route refresh.
      const result = await switchCreed(creed.id);
      if (!result.ok) {
        toast.error(result.error ?? "Could not switch Creed.");
      }
      setSwitching(false);
    } catch {
      toast.error("Could not switch Creed.");
      setSwitching(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch Creed"
          disabled={switching}
          // No card: aligned like the plain title, greyed on hover the same way
          // the brand mark dims (opacity), and the arrow points down by default,
          // flipping up while the menu is open.
          className="group/switcher inline-flex items-center gap-2 text-left transition-opacity duration-200 hover:opacity-60"
        >
          <span className={TITLE_CLASS}>{displayName} / Creed</span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-[var(--creed-text-primary)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]/switcher:rotate-180"
            strokeWidth={2}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[264px] border-[var(--creed-border)] bg-[var(--creed-surface)] p-1.5">
        {creeds.map((creed) => {
          const label = creed.type === "personal" ? state.user.name : creed.name;
          const isActive = creed.id === activeId;
          return (
            <DropdownMenuItem
              key={creed.id}
              disabled={switching}
              onSelect={() => {
                void switchTo(creed);
              }}
              className="flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-[14px]"
            >
              <span className="truncate text-[var(--creed-text-primary)]">{label}</span>
              {creed.needsSetup ? (
                <span
                  className="shrink-0 rounded-[6px] px-2 py-0.5 text-[11px] font-medium text-white"
                  style={{ backgroundColor: creed.type === "company" ? "#F59E0B" : "var(--creed-accent)" }}
                >
                  Set up
                </span>
              ) : isActive ? (
                <Check className="h-4 w-4 shrink-0 text-white" strokeWidth={1.8} />
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
