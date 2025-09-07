import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { Article, mockArticleService } from '@/lib/mockData';
import { useEffect, useState } from 'react';
import { loadContentIndex } from '@/lib/publicContent';

const Articles = () => {
  const [publishedArticles, setPublishedArticles] = useState<Article[]>(mockArticleService.getPublishedArticles());
  useEffect(() => {
    (async () => {
      try {
        const publicPosts = await loadContentIndex();
        if (!publicPosts || publicPosts.length === 0) return;
        // Skip user loading to avoid 404 errors - use default author info
        const mapped: Article[] = publicPosts.map((p, idx) => {
          return {
            id: p.slug,
            title: p.title || '',
            summary: p.description || '',
            content: p.body || '',
            status: 'PUBLISHED' as const,
            authorId: 'author',
            author: { id: 'author', email: '', name: 'Author', role: 'USER' as const, avatarUrl: undefined },
            categoryId: 'cms',
            category: { id: 'cms', name: (p.category as any) || 'General', slug: String(p.category || 'general').toLowerCase() },
            tags: (p.tags || []).map((t: any, i: number) => ({ id: String(i), name: String(t), slug: String(t).toLowerCase() })),
            publishedAt: p.date,
            createdAt: p.date,
            updatedAt: p.date,
          };
        });
        setPublishedArticles(mapped);
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Articles</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of technical articles and tutorials.
          </p>
        </div>
        
        <ArticleList 
          articles={publishedArticles} 
          emptyMessage="No articles published yet. Be the first to share your knowledge!"
        />
      </div>
    </div>
  );
};

export default Articles;
