"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Article } from "@/lib/types";

const STORAGE_KEY = "techpulse-bookmarks";

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(STORAGE_KEY) || "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

export function useBookmarks() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const bookmarks: Article[] = JSON.parse(raw);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggle = useCallback((article: Article) => {
    const current: Article[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const exists = current.some((b) => b.id === article.id);
    const next = exists
      ? current.filter((b) => b.id !== article.id)
      : [article, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitChange();
  }, []);

  const clearAll = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "[]");
    emitChange();
  }, []);

  return { bookmarks, isBookmarked, toggle, clearAll, count: bookmarks.length };
}
