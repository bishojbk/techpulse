"use client";

import { useEffect, useState, useCallback } from "react";
import { Article } from "@/lib/types";
import { fetchArticles } from "@/lib/tauri";

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return { articles, loading, error, refresh };
}
