import Parser from "rss-parser";
import { Article } from "./types";
import { RSS_SOURCES, REDDIT_SOURCES, getSourceIcon } from "./sources";
import { categorize } from "./categorize";
import { stripHtml, truncate, hashString, normalizeUrl, extractImageUrl } from "./utils";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      ["content:encoded", "content:encoded"],
    ],
  },
  // We don't use parseURL anymore (we fetch ourselves so we can set headers
  // for sources like Reddit that 403 anonymous requests), but keep a small
  // safety timeout in case parseString stalls on a malformed feed.
  timeout: 8000,
});

// Reddit started 403-ing non-browser UAs in late 2024, and several WAF-fronted
// sources (Bleeping Computer, Tom's Hardware) drop generic Node clients too.
// A real-looking browser UA + Accept-Language has been the most reliable
// combination in testing.
const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  Accept:
    "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5",
  "Accept-Language": "en-US,en;q=0.9",
};

async function fetchFeedXml(url: string, timeoutMs = 9000): Promise<string> {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// --- RSS Feed Fetching ---

async function fetchRssFeed(source: { name: string; feedUrl: string; domain: string }): Promise<Article[]> {
  try {
    const xml = await fetchFeedXml(source.feedUrl);
    const feed = await parser.parseString(xml);
    return (feed.items || []).slice(0, 20).map((item) => {
      const url = item.link || "";
      const rawExcerpt = item.contentSnippet || item.content || item["content:encoded"] || "";
      const excerpt = truncate(stripHtml(rawExcerpt), 200);
      const title = item.title || "Untitled";

      return {
        id: hashString(normalizeUrl(url)),
        title,
        excerpt,
        url,
        source: source.name,
        sourceIcon: getSourceIcon(source.domain),
        category: categorize(title, excerpt),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        imageUrl: extractImageUrl(item as unknown as Parameters<typeof extractImageUrl>[0]),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch RSS feed: ${source.name}`, error);
    return [];
  }
}

// --- Hacker News ---

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants: number;
  time: number;
  type: string;
}

async function fetchHackerNews(): Promise<Article[]> {
  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids: number[] = await res.json();
    const top30 = ids.slice(0, 30);

    const stories = await Promise.allSettled(
      top30.map(async (id) => {
        const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return r.json() as Promise<HNItem>;
      })
    );

    return stories
      .filter((r): r is PromiseFulfilledResult<HNItem> => r.status === "fulfilled" && r.value?.title != null)
      .map((r) => {
        const story = r.value;
        const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
        const title = story.title;
        const excerpt = `Discuss on Hacker News — ${story.score ?? 0} points, ${story.descendants ?? 0} comments`;

        return {
          id: hashString(`hn-${story.id}`),
          title,
          excerpt,
          url,
          source: "Hacker News",
          sourceIcon: getSourceIcon("news.ycombinator.com"),
          category: categorize(title, ""),
          publishedAt: new Date(story.time * 1000).toISOString(),
          commentCount: story.descendants ?? 0,
          points: story.score ?? 0,
          hnUrl: `https://news.ycombinator.com/item?id=${story.id}`,
        };
      });
  } catch (error) {
    console.error("Failed to fetch Hacker News", error);
    return [];
  }
}

// --- Reddit RSS ---

async function fetchRedditFeed(source: { name: string; feedUrl: string; domain: string }): Promise<Article[]> {
  try {
    const xml = await fetchFeedXml(source.feedUrl);
    const feed = await parser.parseString(xml);
    return (feed.items || []).slice(0, 15).map((item) => {
      const url = item.link || "";
      const rawExcerpt = item.contentSnippet || item.content || "";
      const excerpt = truncate(stripHtml(rawExcerpt), 200);
      const title = stripHtml(item.title || "Untitled");

      return {
        id: hashString(normalizeUrl(url)),
        title,
        excerpt,
        url,
        source: source.name,
        sourceIcon: getSourceIcon(source.domain),
        category: categorize(title, excerpt),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch Reddit feed: ${source.name}`, error);
    return [];
  }
}

// --- Aggregation ---

function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((a) => {
    const normalized = normalizeUrl(a.url);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

// Reddit aggressively rate-limits per-IP, so firing all subreddits at once
// trips its WAF and most return 403. Run them serially with a tiny breath
// between each to stay under the threshold.
async function fetchRedditFeedsSerially(): Promise<Article[]> {
  const all: Article[] = [];
  for (const src of REDDIT_SOURCES) {
    const items = await fetchRedditFeed(src);
    all.push(...items);
    await new Promise((r) => setTimeout(r, 250));
  }
  return all;
}

export async function fetchAllFeedsUncached(): Promise<Article[]> {
  const [rssResults, hn, reddit] = await Promise.all([
    Promise.allSettled(RSS_SOURCES.map((s) => fetchRssFeed(s))),
    fetchHackerNews(),
    fetchRedditFeedsSerially(),
  ]);

  const allArticles: Article[] = [
    ...rssResults
      .filter(
        (r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled",
      )
      .flatMap((r) => r.value),
    ...hn,
    ...reddit,
  ];

  const deduplicated = deduplicateArticles(allArticles);

  deduplicated.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return capWithSourceQuota(deduplicated, { total: 200, perSource: 2 });
}

/**
 * Slow-publishing sources (Krebs, Quanta, HF Blog) would otherwise be cut by
 * a pure recency cap. Reserve `perSource` slots per source first, then fill
 * the rest by recency from the remaining pool. Both phases preserve the input
 * ordering, which is already publishedAt desc.
 */
function capWithSourceQuota(
  articles: Article[],
  { total, perSource }: { total: number; perSource: number },
): Article[] {
  // Phase 1 — reserve the newest `perSource` items per source. Input is
  // already sorted by publishedAt desc, so a single pass collects them.
  const reservedIds = new Set<string>();
  const counts = new Map<string, number>();
  for (const a of articles) {
    const n = counts.get(a.source) ?? 0;
    if (n < perSource) {
      reservedIds.add(a.id);
      counts.set(a.source, n + 1);
    }
  }

  // Phase 2 — fill remaining slots from the overflow pool, by recency.
  const reserved = articles.filter((a) => reservedIds.has(a.id));
  const slotsLeft = Math.max(0, total - reserved.length);
  const overflow = articles
    .filter((a) => !reservedIds.has(a.id))
    .slice(0, slotsLeft);

  // Phase 3 — merge and re-sort so the final list reads newest-first.
  const merged = [...reserved, ...overflow];
  merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return merged;
}

// Alias for backward compatibility
export const fetchAllFeeds = fetchAllFeedsUncached;
