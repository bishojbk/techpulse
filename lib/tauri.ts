import type { Article } from "./types";

export function isTauri(): boolean {
  return (
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window
  );
}

export async function fetchArticles(): Promise<Article[]> {
  if (isTauri()) {
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke<Article[]>("fetch_all_feeds");
  }

  // Fallback for browser (non-Tauri) — feeds require a backend.
  // In the desktop app, the Rust backend handles all fetching.
  // For web deployment, switch next.config.ts back to server mode.
  console.warn("TechPulse: Not running in Tauri. Feed fetching requires the desktop app or a server backend.");
  return [];
}
