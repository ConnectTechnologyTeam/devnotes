import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, LogOut, PenTool, Settings, User, Users, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { UserBadge } from '@/components/UserBadge';
import { listMarkdown, loadMarkdown } from '@/lib/gitContent';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useState<{ name: string; avatar?: string } | null>(null);

  // Map GitHub login to CMS user profile when available
  useEffect(() => {
    (async () => {
      if (!user?.name) return setProfile(null);
      try {
        const users = await listMarkdown('content/users');
        for (const u of users) {
          const { frontmatter } = await loadMarkdown(u.download_url);
          const gh = (frontmatter.github || '').toString().toLowerCase();
          if (gh && (user.name.toLowerCase() === gh || user.email?.toLowerCase() === gh)) {
            setProfile({ name: frontmatter.name || gh, avatar: frontmatter.avatar });
            return;
          }
        }
        // Fallback to GitHub data if provided by OAuth consumer
        const ghAvatar = (user as any).avatarUrl || (user as any).avatar_url;
        setProfile({ name: user.name, avatar: ghAvatar });
      } catch {
        const ghAvatar = (user as any).avatarUrl || (user as any).avatar_url;
        setProfile(user ? { name: user.name, avatar: ghAvatar } : null);
      }
    })();
  }, [user?.name]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">DevNotes</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`nav-link ${isActive('/categories') ? 'nav-link-active' : ''}`}
            >
              Categories
            </Link>
            <Link 
              to="/tags" 
              className={`nav-link ${isActive('/tags') ? 'nav-link-active' : ''}`}
            >
              Tags
            </Link>
            
            {user && (
              <Link 
                to="/my-articles" 
                className={`nav-link ${isActive('/my-articles') ? 'nav-link-active' : ''}`}
              >
                My Articles
              </Link>
            )}
            
            {user?.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className={`nav-link ${isActive('/admin') ? 'nav-link-active' : ''}`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
            {document.documentElement.classList.contains('dark') || theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {user ? (
            <>
              <Link to="/create">
                <Button variant="outline" size="sm" className="space-x-2">
                  <PenTool className="h-4 w-4" />
                  <span>Write</span>
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="hover:opacity-90 transition-opacity">
                  {profile ? (
                    <UserBadge name={profile.name} avatarUrl={profile.avatar} />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  )}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};