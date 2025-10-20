import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ArticleList } from "@/components/ArticleList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articleService, PostResponse, ApiError } from "@/lib/articleService";
import { Article } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { PenTool, Plus } from "lucide-react";

/**
 * MyArticles Component
 *
 * This component fetches user articles using the API endpoint:
 * GET http://localhost:8081/api/posts?authorId={userId}&status=ALL
 *
 * Then filters the results client-side for each tab:
 * - "all" tab: shows all articles
 * - "draft" tab: filters by status=DRAFT
 * - "pending" tab: filters by status=PENDING
 * - "published" tab: filters by status=PUBLISHED
 * - "rejected" tab: filters by status=REJECTED
 */

// Constants
const TAB_STATES = [
  "all",
  "draft",
  "pending",
  "published",
  "rejected",
] as const;
type TabState = (typeof TAB_STATES)[number];

const MyArticles = () => {
  const { user } = useAuth(); // AuthGuard ensures user is available
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabState>("all");
  const [allArticles, setAllArticles] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all articles with status=ALL, then filter client-side
  const fetchAllArticles = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Single API call to get all articles with status=ALL
      const articles = await articleService.getArticles({
        authorId: user.id,
        status: "ALL",
      });

      setAllArticles(articles);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to load articles";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  // Memoized client-side filtering by status
  const articlesByStatus = useMemo(() => {
    return {
      all: allArticles,
      draft: allArticles.filter((article) => article.status === "DRAFT"),
      pending: allArticles.filter((article) => article.status === "PENDING"),
      published: allArticles.filter(
        (article) => article.status === "PUBLISHED"
      ),
      rejected: allArticles.filter((article) => article.status === "REJECTED"),
    };
  }, [allArticles]);

  useEffect(() => {
    fetchAllArticles();
  }, [fetchAllArticles]);

  // Memoized tab change handler
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabState);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground mt-4">
                Loading your articles...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">
              Failed to load articles
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Button onClick={fetchAllArticles} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Articles</h1>
            <p className="text-muted-foreground">
              Manage and track your published and draft articles
            </p>
          </div>

          <Link to="/create">
            <Button className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Article</span>
            </Button>
          </Link>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({articlesByStatus.all.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({articlesByStatus.draft.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({articlesByStatus.pending.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published ({articlesByStatus.published.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({articlesByStatus.rejected.length})
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            {/* 
              TODO: Update ArticleList and ArticleCard components to handle PostResponse type
              Currently using type assertion as temporary solution since components expect Article interface
            */}
            <TabsContent value="all">
              <ArticleList
                articles={articlesByStatus.all as unknown as Article[]}
                showStatus={true}
                emptyMessage="You haven't written any articles yet. Start by creating your first article!"
              />
            </TabsContent>

            <TabsContent value="draft">
              <ArticleList
                articles={articlesByStatus.draft as unknown as Article[]}
                showStatus={true}
                emptyMessage="No draft articles. Your saved drafts will appear here."
              />
            </TabsContent>

            <TabsContent value="pending">
              <ArticleList
                articles={articlesByStatus.pending as unknown as Article[]}
                showStatus={true}
                emptyMessage="No articles pending review. Submit an article for review to see it here."
              />
            </TabsContent>

            <TabsContent value="published">
              <ArticleList
                articles={articlesByStatus.published as unknown as Article[]}
                showStatus={true}
                emptyMessage="No published articles yet. Keep writing and get your articles approved!"
              />
            </TabsContent>

            <TabsContent value="rejected">
              <div className="space-y-6">
                <ArticleList
                  articles={articlesByStatus.rejected as unknown as Article[]}
                  showStatus={true}
                  emptyMessage="No rejected articles. Articles that need revision will appear here."
                />

                {articlesByStatus.rejected.length > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">
                      📝 What to do with rejected articles:
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Review the feedback provided by our editors</li>
                      <li>• Make the necessary improvements to your content</li>
                      <li>• Update your article and resubmit for review</li>
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {allArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <PenTool className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Start writing your first article
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Share your knowledge with the developer community. Write about
              Java, Spring, microservices, or any technical topic you're
              passionate about.
            </p>
            <Link to="/create">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Article
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
