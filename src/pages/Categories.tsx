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
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Categories</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Browse articles by technology and topic. Find the exact content you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {categoriesWithCounts.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow min-h-[44px]">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl">{category.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm truncate">/{category.slug}</span>
                  </div>
                  <Link to={`/categories/${category.slug}`}>
                    <Button variant="outline" size="sm" className="min-h-[36px] text-xs sm:text-sm shrink-0">
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3">
                      <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      <h2 className="text-xl sm:text-2xl font-bold">{category.name}</h2>
                    </div>
                    <Link to={`/categories/${category.slug}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]">
                        <span className="sm:hidden">View All Articles</span>
                        <span className="hidden sm:inline">View All {category.name} Articles</span>
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