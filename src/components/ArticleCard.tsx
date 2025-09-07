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
    <Card className="article-card h-full flex flex-col hover:shadow-lg transition-all duration-200">
      <CardHeader className="space-y-3 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <Link 
            to={`/articles/${article.id}`}
            className="block group flex-1"
          >
            <h3 className="text-lg sm:text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          {showStatus && (
            <Badge 
              variant={getStatusVariant(article.status)}
              className={`status-badge status-${article.status.toLowerCase()} text-xs shrink-0`}
            >
              {article.status}
            </Badge>
          )}
        </div>
        
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
          {article.summary}
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-4 sm:p-6 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
              {article.author.avatarUrl ? (
                <img src={article.author.avatarUrl} alt={article.author.name} className="w-5 h-5 object-cover" />
              ) : (
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </div>
            <span className="truncate">{article.author.name}</span>
          </div>
          
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            <div className="flex items-center space-x-1">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">{article.category.name}</span>
            </div>
            
            {article.publishedAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{new Date(article.publishedAt).toLocaleDateString()}</span>
                <span className="sm:hidden">{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex flex-wrap gap-1 flex-1">
            {article.tags.slice(0, 2).map((tag) => (
              <Link 
                key={tag.id} 
                to={`/tags/${tag.slug}`}
                className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs hover:bg-secondary-hover transition-colors min-h-[28px]"
              >
                {tag.name}
              </Link>
            ))}
            {article.tags.length > 2 && (
              <span className="text-xs text-muted-foreground self-center">
                +{article.tags.length - 2}
              </span>
            )}
          </div>
          
          <Link 
            to={`/articles/${article.id}`}
            className="text-primary hover:text-primary-hover text-xs sm:text-sm font-medium transition-colors shrink-0 min-h-[44px] flex items-center"
          >
            Read more
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};