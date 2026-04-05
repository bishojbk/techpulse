export type CategoryType =
  | "ai"
  | "dev"
  | "security"
  | "hardware"
  | "startups"
  | "science"
  | "general";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  sourceIcon: string;
  category: CategoryType;
  publishedAt: string; // ISO string for serialization
  imageUrl?: string;
  commentCount?: number;
  points?: number;
  hnUrl?: string;
}

export interface Source {
  name: string;
  feedUrl: string;
  domain: string;
  color: string;
}

export const CATEGORIES: { slug: CategoryType; label: string; color: string }[] = [
  { slug: "ai", label: "AI", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  { slug: "dev", label: "Dev", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  { slug: "security", label: "Security", color: "bg-red-500/15 text-red-400 border-red-500/20" },
  { slug: "hardware", label: "Hardware", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  { slug: "startups", label: "Startups", color: "bg-green-500/15 text-green-400 border-green-500/20" },
  { slug: "science", label: "Science", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" },
  { slug: "general", label: "General", color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" },
];

export function getCategoryMeta(slug: CategoryType) {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[CATEGORIES.length - 1];
}
