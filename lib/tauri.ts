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

  // Web fallback — call the API route (server-side RSS fetching)
  const res = await fetch("/api/feeds/");
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
  return res.json();
}
