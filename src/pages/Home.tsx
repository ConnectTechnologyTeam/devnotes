import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { Button } from '@/components/ui/button';
import { mockArticleService, Article } from '@/lib/mockData';
import { getAllUsers } from '@/lib/contentUtils';
import { loadContentIndex } from '@/lib/publicContent';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-devnotes.jpg';
import { ArrowRight, BookOpen, Code, Lightbulb } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>(mockArticleService.getPublishedArticles());

  useEffect(() => {
    (async () => {
      try {
        // Prefer public content index for zero-auth public rendering
        const publicPosts = await loadContentIndex();
        const posts = publicPosts.map(p => ({
          slug: p.slug,
          title: p.title || '',
          description: p.description || '',
          date: p.date || '',
          body: p.body,
          tags: p.tags || [],
          category: p.category || 'General',
          author: p.author,
        })) as any;
        if (!posts || posts.length === 0) return; // keep mock
        const users = await getAllUsers();
        const mapped: Article[] = posts.map((p, i) => {
          const author = users.find(u => u.slug === (p.author as any));
          return {
            id: p.slug,
            title: p.title,
            summary: p.description || '',
            content: p.body || '',
            status: 'PUBLISHED',
            authorId: author?.slug || 'cms',
            author: { id: author?.slug || 'cms', email: '', name: author?.name || author?.github || 'Author', role: 'USER', avatarUrl: author?.avatar },
            categoryId: 'cms',
            category: { id: 'cms', name: (p.category as any) || 'General', slug: String(p.category || 'general').toLowerCase() },
            tags: (p.tags || []).map((t: any, idx: number) => ({ id: String(idx), name: String(t), slug: String(t).toLowerCase() })),
            publishedAt: p.date,
            createdAt: p.date,
            updatedAt: p.date,
          };
        });
        setArticles(mapped);
      } catch {
        // ignore; fall back to mock
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 bg-gradient-hero overflow-hidden min-h-[320px] sm:min-h-[400px]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="DevNotes Hero" 
            className="w-full h-full object-cover opacity-30"
            loading="lazy"
          />
        </div>
        
        <div className="relative container mx-auto text-center text-white flex flex-col justify-center min-h-[280px] sm:min-h-[360px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
            Developer Knowledge
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-200">Simplified</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed px-4">
            Discover in-depth articles on Java, Spring Framework, Microservices, and modern software architecture. 
            Written by developers, for developers.
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center px-4">
            <Link to={user ? "/create" : "/login"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-3 text-base sm:text-lg min-h-[44px]">
                Start Writing <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link to="/categories" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-6 sm:px-8 py-3 text-base sm:text-lg min-h-[44px]">
                Browse Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 bg-background/50 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Code className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Technical Deep Dives</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Comprehensive tutorials and guides on Java, Spring, microservices, and enterprise architecture patterns.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-background/50 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Best Practices</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Learn from industry experts and discover proven patterns for building scalable, maintainable software.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-background/50 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Quality Content</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                All articles go through a review process to ensure high-quality, accurate, and up-to-date content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Latest Articles</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Stay up-to-date with the latest insights and tutorials from our community of developers.
            </p>
          </div>
          
          <ArticleList 
            articles={articles} 
            emptyMessage="No articles published yet."
          />
          
          {articles.length > 0 && (
            <div className="text-center mt-8 sm:mt-12">
              <Link to="/articles">
                <Button variant="outline" size="lg" className="min-h-[44px]">
                  View All Articles <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;