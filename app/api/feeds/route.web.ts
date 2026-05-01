import { NextResponse } from "next/server";
import { fetchAllFeedsUncached } from "@/lib/feeds";

// Run dynamically on Vercel so RSS is fetched fresh per request, with a
// short edge cache to amortize cost across viewers. The Tauri desktop app
// uses the Rust backend via `invoke("fetch_all_feeds")` and never hits
// this handler, so we exclude it from the Tauri static export via
// pageExtensions in next.config.ts.
export const dynamic = "force-dynamic";

// Fetching 16 RSS feeds + 5 Reddit (serial) + Hacker News in parallel can take
// 10–20s on a cold cache. Vercel's default serverless timeout is 10s; lift it
// so worst-case fetches don't 504. Hobby plan caps at 60s.
export const maxDuration = 30;

export async function GET() {
  try {
    const articles = await fetchAllFeedsUncached();
    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("API feed fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
