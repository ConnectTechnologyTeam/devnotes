import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { articleService, PostResponse } from "@/lib/articleService";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Eye } from "lucide-react";

// Types
interface ProfileData {
  name: string;
  email?: string;
  role?: string;
}

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize profile with safe defaults - will be updated when user data is available
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
  });
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user articles from API and update profile if needed
  const loadProfileData = useCallback(async () => {
    // Safety check - return early if user is not available yet
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Update profile with latest user data (AuthGuard ensures user exists)
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });

      // Load user's articles from API
      try {
        if (user.id) {
          const userArticles = await articleService.getArticlesByAuthor(
            user.id
          );
          // Ensure userArticles is always an array
          setPosts(Array.isArray(userArticles) ? userArticles : []);
        } else {
          setPosts([]);
        }
      } catch (apiError) {
        setPosts([]);
        toast({
          title: "Warning",
          description:
            "Could not load your articles. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Format date helper
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return null;
    }
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            {profile.email && (
              <p className="text-muted-foreground">{profile.email}</p>
            )}
            {profile.role && (
              <p className="text-sm mt-1 capitalize text-primary">
                Role: {profile.role}
              </p>
            )}
          </div>
        </div>

        {/* Articles Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold">
              Articles by {profile.name}
            </h2>
            {Array.isArray(posts) && posts.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({posts.length} article{posts.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>

          {!Array.isArray(posts) || posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No articles yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/articles/${post.id}`}
                          className="font-semibold text-lg hover:underline hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>

                        {post.summary && (
                          <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                            {post.summary}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          {post.publishedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <time dateTime={post.publishedAt}>
                                {formatDate(post.publishedAt)}
                              </time>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                              {post.status.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link to={`/articles/${post.id}`}>
                        <Button variant="outline" size="sm" className="ml-4">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
