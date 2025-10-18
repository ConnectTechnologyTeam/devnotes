import { useState, useEffect, useCallback } from "react";
import { Article } from "@/lib/mockData";
import { loadArticles } from "../helpers/articleMapping";

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useArticles = (): UseArticlesReturn => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedArticles = await loadArticles();
      setArticles(loadedArticles);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load articles";
      setError(errorMessage);
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error("[useArticles] Error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
  };
};
