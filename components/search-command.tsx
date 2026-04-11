"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Article, getCategoryMeta } from "@/lib/types";
import { openUrl } from "@/lib/open-url";

export function SearchCommand({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((url: string) => {
    setOpen(false);
    openUrl(url);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 items-center gap-2 rounded border border-border px-2.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
        aria-label="Search articles"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground rounded">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="border-none shadow-none">
          <CommandInput placeholder="Search articles..." />
          <CommandList>
            <CommandEmpty>No articles found.</CommandEmpty>
            <CommandGroup heading="Articles">
              {articles.map((article) => {
                const cat = getCategoryMeta(article.category);
                return (
                  <CommandItem
                    key={article.id}
                    value={`${article.title} ${article.excerpt}`}
                    onSelect={() => handleSelect(article.url)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start gap-3 overflow-hidden py-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.sourceIcon}
                        alt=""
                        className="mt-0.5 h-4 w-4 shrink-0 rounded-sm"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="truncate font-medium text-sm">{article.title}</span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{article.source}</span>
                          <span className="term-tag">{cat.label}</span>
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
