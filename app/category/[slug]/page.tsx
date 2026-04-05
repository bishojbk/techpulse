import { CATEGORIES } from "@/lib/types";
import { CategoryPageClient } from "@/components/category-page-client";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return {};
  return {
    title: `${cat.label} — TechPulse`,
    description: `Latest ${cat.label.toLowerCase()} news from across the web.`,
  };
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
