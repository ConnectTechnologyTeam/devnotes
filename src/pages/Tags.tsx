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
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Tags</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore articles by specific technologies, frameworks, and concepts. 
            Click on any tag to see related content.
          </p>
        </div>

        {/* Tag Cloud */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="h-5 w-5" />
              <span>Popular Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {tagsWithCounts.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.slug}`}>
                  <Badge 
                    variant="secondary" 
                    className={`hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer px-3 py-1.5 ${getTagSize(tag.articleCount)}`}
                  >
                    {tag.name} ({tag.articleCount})
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tagsWithCounts.filter(tag => tag.articleCount > 0).map((tag) => (
            <Card key={tag.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tag.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {tag.articleCount} {tag.articleCount === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">#{tag.slug}</span>
                  </div>
                  <Link to={`/tags/${tag.slug}`}>
                    <Button variant="outline" size="sm">
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Tag className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">{tag.name}</h2>
                      <Badge variant="secondary" className="text-xs">
                        {tag.articleCount} articles
                      </Badge>
                    </div>
                    <Link to={`/tags/${tag.slug}`}>
                      <Button variant="outline">
                        View All #{tag.name} Articles
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