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
  timeout: 10000,
});

// --- RSS Feed Fetching ---

async function fetchRssFeed(source: { name: string; feedUrl: string; domain: string }): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.feedUrl);
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
    const feed = await parser.parseURL(source.feedUrl);
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

export async function fetchAllFeedsUncached(): Promise<Article[]> {
  const results = await Promise.allSettled([
    ...RSS_SOURCES.map((s) => fetchRssFeed(s)),
    ...REDDIT_SOURCES.map((s) => fetchRedditFeed(s)),
    fetchHackerNews(),
  ]);

  const allArticles = results
    .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const deduplicated = deduplicateArticles(allArticles);

  deduplicated.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return deduplicated.slice(0, 100);
}

// Alias for backward compatibility
export const fetchAllFeeds = fetchAllFeedsUncached;
