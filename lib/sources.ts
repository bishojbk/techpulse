import { Source } from "./types";

export const RSS_SOURCES: Source[] = [
  // ── General tech ──
  {
    name: "TechCrunch",
    feedUrl: "https://techcrunch.com/feed/",
    domain: "techcrunch.com",
    color: "#0a9e01",
  },
  {
    name: "The Verge",
    feedUrl: "https://www.theverge.com/rss/index.xml",
    domain: "theverge.com",
    color: "#e5127d",
  },
  {
    name: "Ars Technica",
    feedUrl: "https://feeds.arstechnica.com/arstechnica/index",
    domain: "arstechnica.com",
    color: "#ff4e00",
  },
  {
    name: "Wired",
    feedUrl: "https://www.wired.com/feed/rss",
    domain: "wired.com",
    color: "#000000",
  },
  {
    name: "VentureBeat",
    feedUrl: "https://venturebeat.com/feed/",
    domain: "venturebeat.com",
    color: "#a41e37",
  },
  {
    name: "Engadget",
    feedUrl: "https://www.engadget.com/rss.xml",
    domain: "engadget.com",
    color: "#4689e8",
  },
  {
    name: "The Register",
    feedUrl: "https://www.theregister.com/headlines.atom",
    domain: "theregister.com",
    color: "#ff0000",
  },

  // ── AI / ML focused ──
  {
    // Use the AI-only feed; the main MIT TR feed is a strict superset that
    // would dedupe-collide with this one (same article URLs).
    name: "MIT Tech Review · AI",
    feedUrl:
      "https://www.technologyreview.com/topic/artificial-intelligence/feed",
    domain: "technologyreview.com",
    color: "#a31d37",
  },
  {
    name: "Hugging Face",
    feedUrl: "https://huggingface.co/blog/feed.xml",
    domain: "huggingface.co",
    color: "#ffd21e",
  },

  // ── Security ──
  {
    name: "Krebs on Security",
    feedUrl: "https://krebsonsecurity.com/feed/",
    domain: "krebsonsecurity.com",
    color: "#c41e3a",
  },
  {
    name: "The Hacker News (security)",
    feedUrl: "https://feeds.feedburner.com/TheHackersNews",
    domain: "thehackernews.com",
    color: "#0066cc",
  },
  {
    name: "Bleeping Computer",
    feedUrl: "https://www.bleepingcomputer.com/feed/",
    domain: "bleepingcomputer.com",
    color: "#1a1a1a",
  },

  // ── Hardware ──
  {
    name: "Tom's Hardware",
    feedUrl: "https://www.tomshardware.com/feeds/all",
    domain: "tomshardware.com",
    color: "#ff6600",
  },

  // ── Science ──
  {
    name: "Quanta Magazine",
    feedUrl: "https://www.quantamagazine.org/feed/",
    domain: "quantamagazine.org",
    color: "#0099cc",
  },

  // ── Programming ──
  {
    name: "Lobsters",
    feedUrl: "https://lobste.rs/rss",
    domain: "lobste.rs",
    color: "#ac130d",
  },
];

export const REDDIT_SOURCES: Source[] = [
  {
    name: "r/technology",
    feedUrl: "https://www.reddit.com/r/technology/.rss",
    domain: "reddit.com",
    color: "#ff4500",
  },
  {
    name: "r/programming",
    feedUrl: "https://www.reddit.com/r/programming/.rss",
    domain: "reddit.com",
    color: "#ff4500",
  },
  {
    name: "r/artificial",
    feedUrl: "https://www.reddit.com/r/artificial/.rss",
    domain: "reddit.com",
    color: "#ff4500",
  },
  {
    name: "r/MachineLearning",
    feedUrl: "https://www.reddit.com/r/MachineLearning/.rss",
    domain: "reddit.com",
    color: "#ff4500",
  },
  {
    name: "r/LocalLLaMA",
    feedUrl: "https://www.reddit.com/r/LocalLLaMA/.rss",
    domain: "reddit.com",
    color: "#ff4500",
  },
];

export function getSourceIcon(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}
