import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { listMarkdown, loadMarkdown, loadJson } from '@/lib/gitContent';
import { Avatar } from '@/components/ui/avatar';

type UserCard = {
  slug: string;
  name: string;
  github?: string;
  avatar?: string;
  role?: 'author'|'editor'|'admin';
  postCount: number;
  lastLogin?: string;
  loginCount?: number;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // load users
        const userFiles = await listMarkdown('content/users');
        const loginMap = await loadJson('data/user-logins.json');

        const posts = await listMarkdown('content/posts');
        const postFrontmatters = await Promise.all(posts.map(p => loadMarkdown(p.download_url)));
        const postAuthorCounts: Record<string, number> = {};
        postFrontmatters.forEach(({ frontmatter }) => {
          const a = frontmatter.author?.toString?.();
          if (!a) return;
          postAuthorCounts[a] = (postAuthorCounts[a] || 0) + 1;
        });

        const entries: UserCard[] = [];
        for (const f of userFiles) {
          const slug = f.name.replace(/\.md$/, '');
          const { frontmatter } = await loadMarkdown(f.download_url);
          entries.push({
            slug,
            name: frontmatter.name || frontmatter.github || slug,
            github: frontmatter.github,
            avatar: frontmatter.avatar,
            role: frontmatter.role,
            postCount: postAuthorCounts[slug] || 0,
            lastLogin: loginMap[frontmatter.github || slug]?.lastLogin,
            loginCount: loginMap[frontmatter.github || slug]?.loginCount,
          });
        }
        setUsers(entries.sort((a,b) => (b.postCount||0)-(a.postCount||0)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin • Users</h1>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-4">
            <div className="grid grid-cols-6 text-xs uppercase text-muted-foreground px-2">
              <div className="col-span-2">User</div>
              <div>GitHub</div>
              <div>Posts</div>
              <div>Last Login</div>
              <div>Login Count</div>
            </div>
            {users.map(u => (
              <Card key={u.slug}>
                <CardContent className="p-3 grid grid-cols-6 items-center">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                      {u.avatar ? <img src={u.avatar} alt={u.name} className="w-8 h-8 object-cover"/> : <div className="w-8 h-8"/>}
                    </div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      {u.role && <div className="text-xs text-muted-foreground">{u.role}</div>}
                    </div>
                  </div>
                  <div>{u.github || '-'}</div>
                  <div>{u.postCount}</div>
                  <div>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '-'}</div>
                  <div>{u.loginCount ?? '-'}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;



