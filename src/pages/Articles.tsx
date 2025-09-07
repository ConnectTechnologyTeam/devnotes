import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { mockArticleService } from '@/lib/mockData';

const Articles = () => {
  const publishedArticles = mockArticleService.getPublishedArticles();

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
