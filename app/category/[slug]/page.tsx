import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/types";
import { CategoryPageClient } from "@/components/category-page-client";
import { SITE } from "@/lib/site";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ai: "Latest AI and machine-learning stories — frontier model releases, research papers, lab announcements, and industry moves from Hugging Face, MIT Tech Review, r/MachineLearning, and more.",
  dev: "Developer and engineering news — frameworks, languages, tooling, and open-source projects from Hacker News, Lobsters, r/programming, and the wider tech press.",
  security: "Security and infosec news — breaches, vulnerabilities, malware, and policy. Curated from Krebs on Security, The Hacker News, Bleeping Computer, and others.",
  hardware: "Hardware news — chips, GPUs, devices, and silicon roadmaps from Tom's Hardware, Ars Technica, The Register, and the wider press.",
  startups: "Startup news — funding rounds, acquisitions, and product launches across the tech ecosystem.",
  science: "Tech-adjacent science — physics, biology, space, and research from Quanta Magazine, MIT Tech Review, and Wired.",
  general: "General tech stories — culture, policy, and industry from The Verge, TechCrunch, Wired, and Engadget.",
};

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  const title = `${cat.label} — ${SITE.name}`;
  const description =
    CATEGORY_DESCRIPTIONS[slug] ??
    `Latest ${cat.label.toLowerCase()} news from across the web.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title,
      description,
      url: `/category/${slug}`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
