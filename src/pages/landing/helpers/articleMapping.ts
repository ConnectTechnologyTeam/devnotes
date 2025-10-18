import { Article } from "@/lib/mockData";
import { loadContentIndex } from "@/lib/publicContent";

export interface PublicPost {
  slug: string;
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  category?: string;
  author?: string;
  body: string;
  draft?: boolean;
}

/**
 * Maps public posts from content index to Article interface
 * @param publicPosts - Array of public posts from content index
 * @returns Array of mapped Article objects
 */
export const mapPublicPostsToArticles = (
  publicPosts: PublicPost[]
): Article[] => {
  if (!publicPosts || publicPosts.length === 0) {
    return [];
  }

  return publicPosts.map((post, index) => ({
    id: post.slug,
    title: post.title || "",
    summary: post.description || "",
    content: post.body || "",
    status: "PUBLISHED" as const,
    authorId: "author",
    author: {
      id: "author",
      email: "",
      name: "Author",
      role: "USER" as const,
      avatarUrl: undefined,
    },
    categoryId: "cms",
    category: {
      id: "cms",
      name: (post.category as string) || "General",
      slug: String(post.category || "general").toLowerCase(),
    },
    tags: (post.tags || []).map((tag: string, idx: number) => ({
      id: String(idx),
      name: String(tag),
      slug: String(tag).toLowerCase(),
    })),
    publishedAt: post.date,
    createdAt: post.date,
    updatedAt: post.date,
  }));
};

/**
 * Loads and processes articles from content index
 * @returns Promise<Article[]> - Array of processed articles
 */
export const loadArticles = async (): Promise<Article[]> => {
  try {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[Home] Loading content index...");
    }
    const publicPosts = await loadContentIndex();
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[Home] Loaded posts:", publicPosts?.length || 0);
    }

    const mappedArticles = mapPublicPostsToArticles(publicPosts || []);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[Home] Mapped articles:", mappedArticles.length);
    }

    return mappedArticles;
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[Home] Error loading content:", error);
    }
    return [];
  }
};
