import { ArticleCard } from './ArticleCard';
import type { PostResponse } from '@/lib/articleService';

interface ArticleListProps {
  articles: PostResponse[];
  showStatus?: boolean;
  emptyMessage?: string;
}

export const ArticleList = ({ 
  articles, 
  showStatus = false, 
  emptyMessage = "No articles found." 
}: ArticleListProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          showStatus={showStatus}
        />
      ))}
    </div>
  );
};