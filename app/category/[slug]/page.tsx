import { CATEGORIES } from "@/lib/types";
import { CategoryPageClient } from "@/components/category-page-client";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.label} — TechPulse`,
    description: `Latest ${cat.label.toLowerCase()} news from across the web.`,
  };
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
