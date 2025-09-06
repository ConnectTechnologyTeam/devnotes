import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCategories, mockArticles } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import { Folder, FileText } from 'lucide-react';

const Categories = () => {
  const publishedArticles = mockArticles.filter(article => article.status === 'PUBLISHED');
  
  const categoriesWithCounts = mockCategories.map(category => ({
    ...category,
    articleCount: publishedArticles.filter(article => article.categoryId === category.id).length
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Categories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse articles by technology and topic. Find the exact content you're looking for.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categoriesWithCounts.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Folder className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">/{category.slug}</span>
                  </div>
                  <Link to={`/categories/${category.slug}`}>
                    <Button variant="outline" size="sm">
                      View Articles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Articles from Different Categories */}
        <div className="space-y-12">
          {categoriesWithCounts
            .filter(category => category.articleCount > 0)
            .slice(0, 3)
            .map((category) => {
              const categoryArticles = publishedArticles
                .filter(article => article.categoryId === category.id)
                .slice(0, 3);
              
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Folder className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                    </div>
                    <Link to={`/categories/${category.slug}`}>
                      <Button variant="outline">
                        View All {category.name} Articles
                      </Button>
                    </Link>
                  </div>
                  <ArticleList articles={categoryArticles} />
                </div>
              );
            })}
        </div>

        {publishedArticles.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground">
              Articles will be organized by categories once they're published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;