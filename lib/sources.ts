import { Source } from "./types";

export const RSS_SOURCES: Source[] = [
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
    name: "MIT Tech Review",
    feedUrl: "https://www.technologyreview.com/feed/",
    domain: "technologyreview.com",
    color: "#a31d37",
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
];

export function getSourceIcon(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

// Branded gradient backgrounds for placeholder cards
const SOURCE_GRADIENTS: Record<string, { from: string; to: string }> = {
  TechCrunch: { from: "#0A9E01", to: "#064D00" },
  Wired: { from: "#1a1a1a", to: "#333333" },
  "Ars Technica": { from: "#FF4E00", to: "#8B2A00" },
  VentureBeat: { from: "#003366", to: "#001a33" },
  "The Verge": { from: "#6B2FA0", to: "#3A1A5C" },
  Engadget: { from: "#0066CC", to: "#003366" },
  "MIT Tech Review": { from: "#CC0000", to: "#660000" },
  "r/technology": { from: "#FF4500", to: "#8B2500" },
  "r/programming": { from: "#FF4500", to: "#8B2500" },
  "r/artificial": { from: "#FF4500", to: "#8B2500" },
  "Hacker News": { from: "#FF6600", to: "#993D00" },
};

const GRADIENT_DIRECTIONS = [
  "to bottom right",
  "to bottom left",
  "to right",
  "135deg",
  "160deg",
  "200deg",
];

export function getSourceGradient(source: string, index: number): string {
  const g = SOURCE_GRADIENTS[source] ?? { from: "#2a2a2a", to: "#1a1a1a" };
  const dir = GRADIENT_DIRECTIONS[index % GRADIENT_DIRECTIONS.length];
  return `linear-gradient(${dir}, ${g.from}, ${g.to})`;
}

export function getUniqueSourceCount(sources: string[]): number {
  return new Set(sources).size;
}
