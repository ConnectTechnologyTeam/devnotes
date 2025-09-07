import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getAllPosts, getAllUsers } from '@/lib/contentUtils';
import { mockArticleService } from '@/lib/mockData';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Edit3 } from 'lucide-react';

interface ProfileData {
  slug?: string;
  name: string;
  github?: string;
  avatar?: string;
  bio?: string;
  role?: 'author' | 'editor' | 'admin';
}

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        // Try load profile from CMS users collection
        const users = await getAllUsers();
        const byGithub = users.find(u => u.github && user && u.github.toLowerCase() === (user.name || '').toLowerCase());
        const finalProfile: ProfileData | null = byGithub
          ? { slug: byGithub.slug, name: byGithub.name || byGithub.github || 'User', github: byGithub.github, avatar: byGithub.avatar, bio: byGithub.bio, role: (byGithub.role as any) }
          : user
            ? { name: user.name, github: user.email, avatar: (user as any).avatarUrl || (user as any).avatar_url }
            : null;
        setProfile(finalProfile);

        // Load posts: prefer CMS posts matched by author slug; fallback to mock articles by authorId
        const cmsPosts = await getAllPosts();
        let authored: any[] = [];
        if (finalProfile?.slug) {
          authored = cmsPosts.filter(p => String(p.author).toLowerCase() === String(finalProfile.slug).toLowerCase());
        }
        if (authored.length === 0 && user) {
          authored = mockArticleService.getArticlesByAuthor(user.id);
        }
        setPosts(authored);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.name]);

  const handleAvatarUpload = (imageUrl: string) => {
    if (!profile) return;
    setProfile({ ...profile, avatar: imageUrl });
    // persist into currentUser for reuse
    try {
      const raw = localStorage.getItem('devnotes_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.avatarUrl = imageUrl;
        localStorage.setItem('devnotes_user', JSON.stringify(parsed));
      }
    } catch {}
    setIsEditingAvatar(false);
    toast({ title: 'Avatar updated', description: 'Your profile picture has been updated successfully.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading profile...</p>
          </div>
        ) : !profile ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">No profile found</h1>
            <p className="text-muted-foreground">Sign in to view your profile.</p>
            <Link to="/login"><Button className="mt-6">Sign in</Button></Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start gap-6 mb-10">
              <div className="relative group">
                <img
                  src={profile.avatar || ''}
                  alt={profile.name}
                  className="h-20 w-20 rounded-full object-cover bg-muted"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditingAvatar(true)}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {profile.github && (
                  <p className="text-muted-foreground">@{profile.github}</p>
                )}
                {profile.role && (
                  <p className="text-sm mt-1 capitalize">Role: {profile.role}</p>
                )}
                {profile.bio && (
                  <p className="mt-3 text-foreground/90 max-w-2xl">{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Avatar Upload Modal */}
            {isEditingAvatar && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
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

            {/* Posts */}
            <h2 className="text-2xl font-semibold mb-4">Articles by {profile.name}</h2>
            {posts.length === 0 ? (
              <p className="text-muted-foreground">No articles yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((p: any) => (
                  <Card key={p.id || p.slug}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <Link to={`/articles/${p.id || p.slug}`} className="font-medium hover:underline">
                          {p.title}
                        </Link>
                        {p.date || p.publishedAt ? (
                          <p className="text-xs text-muted-foreground mt-1">{new Date(p.date || p.publishedAt).toLocaleDateString()}</p>
                        ) : null}
                      </div>
                      <Link to={`/articles/${p.id || p.slug}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;


