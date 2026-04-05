import { NextResponse } from "next/server";
import { fetchAllFeedsUncached } from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await fetchAllFeedsUncached();
    return NextResponse.json(articles, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("API feed fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
