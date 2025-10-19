import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { articleService, PostResponse } from "@/lib/articleService";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Calendar, Eye } from "lucide-react";

// Types
interface ProfileData {
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

// Constants
const STORAGE_KEY = "devnotes_user";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize profile immediately from user data (AuthGuard ensures user exists)
  const [profile, setProfile] = useState<ProfileData>(() => {
    // Safety check in case user is still loading
    if (!user) {
      return {
        name: "",
        email: "",
        avatar: "",
        role: "",
      };
    }
    return {
      name: user.name || "",
      email: user.email || "",
      avatar: (user as any).avatarUrl || (user as any).avatar_url || "",
      role: user.role || "",
    };
  });
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

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
        avatar: (user as any).avatarUrl || (user as any).avatar_url || "",
        role: user.role || "",
      });

      // Load user's articles from API
      try {
        if (user.id) {
          const userArticles = await articleService.getArticlesByAuthor(
            user.id
          );
          setPosts(userArticles);
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

  // Handle avatar upload
  const handleAvatarUpload = useCallback(
    (imageUrl: string) => {
      setProfile((prev) => ({ ...prev, avatar: imageUrl }));

      // Persist avatar URL in localStorage for reuse
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.avatarUrl = imageUrl;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch (error) {
        // Silently handle localStorage errors
      }

      setIsEditingAvatar(false);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    [toast]
  );

  // Handle image error
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = "none";
    },
    []
  );

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
          <div className="relative group">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover bg-muted"
                onError={handleImageError}
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg font-semibold text-muted-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditingAvatar(true)}
              aria-label="Edit avatar"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
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

        {/* Avatar Upload Modal */}
        {isEditingAvatar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Update Profile Picture
              </h3>
              <ImageUpload
                onImageInsert={handleAvatarUpload}
                className="mb-4"
                size="lg"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingAvatar(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Articles Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold">
              Articles by {profile.name}
            </h2>
            {posts.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({posts.length} article{posts.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No articles yet.</p>
              <Link to="/create">
                <Button>Write your first article</Button>
              </Link>
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
