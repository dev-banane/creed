// Tiny client-side store for which welcome-tour variant the dev P shortcut
// should open. The app shell publishes the active space's variant (personal vs
// company) as the user moves between Creeds; the single P listener (mounted at
// the root via WelcomeDevPreview) reads it on keypress so P shows the company
// tour inside a company space and the personal tour everywhere else. Dev-only in
// effect - nothing reads it in production.

export type WelcomeVariant = "personal" | "company";

let current: WelcomeVariant = "personal";

export function setWelcomePreviewVariant(variant: WelcomeVariant) {
  current = variant;
}

export function getWelcomePreviewVariant(): WelcomeVariant {
  return current;
}
