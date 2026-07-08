"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

const UPDATE_TOAST_ID = "creed-app-version-update";
const IGNORED_VERSION_KEY = "creed:ignored-app-version";
const VERSION_CHECK_INTERVAL_MS = 60_000;

type AppVersionNotifierProps = {
  initialVersion: string;
};

type VersionPayload = {
  version?: string | null;
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']"),
  );
}

function getIgnoredVersion() {
  try {
    return window.localStorage.getItem(IGNORED_VERSION_KEY);
  } catch {
    return null;
  }
}

function setIgnoredVersion(version: string) {
  try {
    window.localStorage.setItem(IGNORED_VERSION_KEY, version);
  } catch {
    // Ignore storage failures. The button should still dismiss the card.
  }
}

function VersionNoticeCard({
  version,
  preview,
  onIgnore,
  onRefresh,
}: {
  version: string;
  preview?: boolean;
  onIgnore: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-[14px] border border-[var(--creed-border)] bg-[var(--creed-background)] p-3.5 text-[var(--creed-text-primary)] shadow-[0_10px_30px_rgba(28,28,26,0.10)]">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium leading-5">
          New version available
        </div>
        {preview ? (
          <div className="mt-0.5 text-[12px] leading-4 text-[var(--creed-text-tertiary)]">
            Dev preview
          </div>
        ) : null}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onIgnore}
          className="inline-flex h-7 items-center rounded-md px-2 text-sm font-medium text-[var(--creed-text-secondary)] transition-colors hover:bg-[var(--creed-surface-raised)] hover:text-[var(--creed-text-primary)]"
        >
          Ignore
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-7 items-center rounded-md bg-[#2563eb] px-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
        >
          Refresh
        </button>
      </div>
      <span className="sr-only">Version {version}</span>
    </div>
  );
}

export function AppVersionNotifier({
  initialVersion,
}: AppVersionNotifierProps) {
  const shownVersionRef = useRef<string | null>(null);

  const showVersionNotice = useCallback(
    (version: string, preview = false) => {
      shownVersionRef.current = version;
      toast.custom(
        (toastId) => (
          <VersionNoticeCard
            version={version}
            preview={preview}
            onIgnore={() => {
              if (!preview) {
                setIgnoredVersion(version);
              }
              shownVersionRef.current = null;
              toast.dismiss(toastId);
            }}
            onRefresh={() => {
              window.location.reload();
            }}
          />
        ),
        {
          id: UPDATE_TOAST_ID,
          duration: Infinity,
          closeButton: false,
          dismissible: false,
          classNames: {
            toast:
              "!border-0 !bg-transparent !p-0 !pr-0 !shadow-none !text-[var(--creed-text-primary)]",
            content: "!w-full",
            title: "!w-full",
          },
        },
      );
    },
    [],
  );

  const checkForUpdate = useCallback(async () => {
    try {
      const response = await fetch(`/api/version?ts=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as VersionPayload;
      const latestVersion = payload.version?.trim();
      if (!latestVersion || latestVersion === initialVersion) {
        return;
      }
      if (latestVersion === shownVersionRef.current) {
        return;
      }
      if (latestVersion === getIgnoredVersion()) {
        return;
      }

      showVersionNotice(latestVersion);
    } catch {
      // Version checks should never interrupt normal app use.
    }
  }, [initialVersion, showVersionNotice]);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      checkForUpdate,
      VERSION_CHECK_INTERVAL_MS,
    );
    const intervalId = window.setInterval(
      checkForUpdate,
      VERSION_CHECK_INTERVAL_MS,
    );

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        void checkForUpdate();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [checkForUpdate]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() !== "r" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.repeat ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      showVersionNotice("dev-preview", true);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showVersionNotice]);

  return null;
}
