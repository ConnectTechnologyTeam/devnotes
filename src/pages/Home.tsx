import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { Button } from '@/components/ui/button';
import { mockArticleService, Article } from '@/lib/mockData';
import { getAllPosts, getAllUsers } from '@/lib/contentUtils';
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
        const posts = await getAllPosts();
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
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="DevNotes Hero" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative container mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Developer Knowledge
            <span className="block text-4xl md:text-5xl text-blue-200">Simplified</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Discover in-depth articles on Java, Spring Framework, Microservices, and modern software architecture. 
            Written by developers, for developers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={user ? "/create" : "/login"}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg">
                Start Writing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                Browse Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Technical Deep Dives</h3>
              <p className="text-muted-foreground">
                Comprehensive tutorials and guides on Java, Spring, microservices, and enterprise architecture patterns.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
              <p className="text-muted-foreground">
                Learn from industry experts and discover proven patterns for building scalable, maintainable software.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Content</h3>
              <p className="text-muted-foreground">
                All articles go through a review process to ensure high-quality, accurate, and up-to-date content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay up-to-date with the latest insights and tutorials from our community of developers.
            </p>
          </div>
          
          <ArticleList 
            articles={articles} 
            emptyMessage="No articles published yet."
          />
          
          {articles.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/articles">
                <Button variant="outline" size="lg">
                  View All Articles <ArrowRight className="ml-2 h-5 w-5" />
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