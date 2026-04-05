"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBar() {
  const pathname = usePathname();

  const isActive = (slug: string | null) => {
    if (slug === null) return pathname === "/";
    return pathname === `/category/${slug}`;
  };

  return (
    <div className="sticky top-14 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 scrollbar-none"
        aria-label="Category filter"
      >
        <Link
          href="/"
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
            isActive(null)
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              isActive(cat.slug)
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {cat.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
