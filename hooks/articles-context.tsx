"use client";

import { createContext, useContext } from "react";
import { useArticles } from "./use-articles";
import { Article } from "@/lib/types";

interface ArticlesContextValue {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ArticlesContext = createContext<ArticlesContextValue>({
  articles: [],
  loading: true,
  error: null,
  refresh: async () => {},
});

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const value = useArticles();
  return (
    <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>
  );
}

export function useArticlesContext() {
  return useContext(ArticlesContext);
}
