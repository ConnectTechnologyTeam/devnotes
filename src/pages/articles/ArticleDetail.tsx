import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { articleService, PostResponse, ApiError } from "@/lib/articleService";
import { Article } from "@/lib/mockData";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { calculateReadingTime } from "@/lib/readingUtils";
import { processContentWithImageUrls } from "@/lib/articleContentUtils";
import {
  ArticleMetadata,
  ArticleTags,
  ArticleActions,
  ErrorState,
  LoadingState,
  MarkdownRenderer,
} from "@/components/articles";

/**
 * ArticleDetail Page Component
 *
 * Displays a single article with:
 * - Article metadata (author, category, date, reading time)
 * - Article content with markdown rendering and image support
 * - Action buttons (share, bookmark, delete)
 * - Reading progress indicator
 * - Error and loading states
 *
 * Features:
 * - Converts indexed image placeholders (${0}, ${1}) to actual image URLs
 * - Responsive design with mobile-first approach
 * - Accessible navigation and error handling
 */
const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const readingProgress = useReadingProgress();

  /**
   * Transforms API response (PostResponse) to Article format
   * Processes content to replace indexed placeholders with image URLs
   */
  const transformPostToArticle = useCallback(
    (postData: PostResponse): Article => {
      // Process content to replace indexed placeholders with image URLs
      const processedContent = processContentWithImageUrls(
        postData.content,
        postData.images
      );

      return {
        id: postData.id, // Keep as number to match Article interface
        title: postData.title,
        summary: "", // Empty summary since we're not using it
        content: processedContent,
        status: postData.status,
        authorId: postData.author.id.toString(),
        author: {
          id: postData.author.id.toString(),
          name: postData.author.username || postData.author.email.split("@")[0], // Map username to name
          email: postData.author.email,
          role: postData.author.role as "USER" | "ADMIN",
        },
        categoryId: postData.category.id.toString(),
        category: {
          id: postData.category.id.toString(),
          name: postData.category.name,
          slug: postData.category.slug,
        },
        tags: postData.tags.map((tag) => ({
          id: tag.id.toString(),
          name: tag.name,
          slug: tag.slug,
        })),
        publishedAt: postData.publishedAt || undefined,
        createdAt: postData.createdAt,
        updatedAt: postData.updatedAt,
        rejectNote: postData.rejectReason || undefined,
      };
    },
    []
  );

  /**
   * Fetches article data from the API
   * Handles loading states, errors, and data transformation
   */
  const fetchArticle = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const postData = await articleService.getArticleById(slug);
      const articleData = transformPostToArticle(postData);
      setArticle(articleData);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError && err.status === 404
          ? "Article not found"
          : err instanceof ApiError
          ? err.message
          : "Failed to load article";

      setError(errorMessage);

      // Only show toast for non-404 errors (404 handled by ErrorState component)
      if (!(err instanceof ApiError && err.status === 404)) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [slug, transformPostToArticle, toast]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  // Memoized values for performance
  const readingTime = useMemo(
    () => (article ? calculateReadingTime(article.content) : 0),
    [article]
  );

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingState onBack={handleBack} />
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ErrorState error={error} onRetry={fetchArticle} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Article Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleBack}
            className="nav-back inline-flex items-center mb-4 sm:mb-6 min-h-[44px] hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          <div className="space-y-4 sm:space-y-6">
            {/* Article Metadata and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ArticleMetadata article={article} readingTime={readingTime} />
              <ArticleActions article={article} user={user} />
            </div>

            {/* Article Title */}
            <h1 className="article-detail-title leading-tight">
              {article.title}
            </h1>

            {/* Tags */}
            <ArticleTags tags={article.tags} />
          </div>
        </div>

        {/* Article Content */}
        <MarkdownRenderer content={article.content} />
      </article>
    </div>
  );
};

export default ArticleDetail;
