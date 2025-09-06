import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Article } from '@/lib/mockData';
import { Calendar, Clock, Tag, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  showStatus?: boolean;
}

export const ArticleCard = ({ article, showStatus = false }: ArticleCardProps) => {
  const getStatusVariant = (status: Article['status']) => {
    switch (status) {
      case 'PUBLISHED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'DRAFT':
        return 'outline';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="article-card h-full flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <Link 
            to={`/articles/${article.id}`}
            className="block group"
          >
            <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>
          {showStatus && (
            <Badge 
              variant={getStatusVariant(article.status)}
              className={`status-badge status-${article.status.toLowerCase()}`}
            >
              {article.status}
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground leading-relaxed">
          {article.summary}
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{article.author.name}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Tag className="h-4 w-4" />
            <span>{article.category.name}</span>
          </div>
          
          {article.publishedAt && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <Link 
                key={tag.id} 
                to={`/tags/${tag.slug}`}
                className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs hover:bg-secondary-hover transition-colors"
              >
                {tag.name}
              </Link>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
          
          <Link 
            to={`/articles/${article.id}`}
            className="text-primary hover:text-primary-hover text-sm font-medium transition-colors"
          >
            Read more
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};