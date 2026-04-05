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
import { Article } from "@/lib/types";
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
        className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Search articles"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border-none shadow-none">
          <CommandInput placeholder="Search articles..." />
          <CommandList>
            <CommandEmpty>No articles found.</CommandEmpty>
            <CommandGroup heading="Articles">
              {articles.map((article) => (
                <CommandItem
                  key={article.id}
                  value={`${article.title} ${article.excerpt}`}
                  onSelect={() => handleSelect(article.url)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-xs text-muted-foreground">{article.source}</span>
                    <span className="truncate font-medium">{article.title}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
