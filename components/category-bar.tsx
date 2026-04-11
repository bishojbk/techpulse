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
    <div className="sticky top-0 z-40 border-b border-border bg-background">
      <nav
        className="mx-auto flex max-w-7xl items-center gap-0 overflow-x-auto px-4 sm:px-6 scrollbar-none"
        aria-label="Category filter"
      >
        <Link
          href="/"
          className={cn(
            "relative shrink-0 px-4 py-3 text-[13px] font-semibold transition-colors",
            isActive(null)
              ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Home
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={cn(
              "relative shrink-0 px-4 py-3 text-[13px] font-semibold transition-colors",
              isActive(cat.slug)
                ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
