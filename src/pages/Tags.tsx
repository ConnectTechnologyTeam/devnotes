import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockTags, mockArticles } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import { Tag, FileText, Hash } from 'lucide-react';

const Tags = () => {
  const publishedArticles = mockArticles.filter(article => article.status === 'PUBLISHED');
  
  const tagsWithCounts = mockTags.map(tag => ({
    ...tag,
    articleCount: publishedArticles.filter(article => 
      article.tags.some(articleTag => articleTag.id === tag.id)
    ).length
  })).sort((a, b) => b.articleCount - a.articleCount);

  const getTagSize = (count: number) => {
    if (count >= 3) return 'text-lg';
    if (count >= 2) return 'text-base';
    return 'text-sm';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Tags</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Explore articles by specific technologies, frameworks, and concepts. 
            Click on any tag to see related content.
          </p>
        </div>

        {/* Tag Cloud */}
        <Card className="mb-8 sm:mb-12">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Popular Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {tagsWithCounts.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.slug}`}>
                  <Badge 
                    variant="secondary" 
                    className={`hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer px-3 py-2 min-h-[36px] ${getTagSize(tag.articleCount)}`}
                  >
                    {tag.name} ({tag.articleCount})
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {tagsWithCounts.filter(tag => tag.articleCount > 0).map((tag) => (
            <Card key={tag.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg">{tag.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {tag.articleCount} {tag.articleCount === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm truncate">#{tag.slug}</span>
                  </div>
                  <Link to={`/tags/${tag.slug}`}>
                    <Button variant="outline" size="sm" className="min-h-[36px] text-xs sm:text-sm shrink-0">
                      View Articles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Articles by Tag */}
        <div className="space-y-12">
          {tagsWithCounts
            .filter(tag => tag.articleCount > 0)
            .slice(0, 3)
            .map((tag) => {
              const tagArticles = publishedArticles
                .filter(article => article.tags.some(articleTag => articleTag.id === tag.id))
                .slice(0, 3);
              
              return (
                <div key={tag.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3">
                      <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      <h2 className="text-xl sm:text-2xl font-bold">{tag.name}</h2>
                      <Badge variant="secondary" className="text-xs">
                        {tag.articleCount}
                      </Badge>
                    </div>
                    <Link to={`/tags/${tag.slug}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]">
                        <span className="sm:hidden">View All Articles</span>
                        <span className="hidden sm:inline">View All #{tag.name} Articles</span>
                      </Button>
                    </Link>
                  </div>
                  <ArticleList articles={tagArticles} />
                </div>
              );
            })}
        </div>

        {publishedArticles.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tagged articles yet</h3>
            <p className="text-muted-foreground">
              Articles will be organized by tags once they're published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;