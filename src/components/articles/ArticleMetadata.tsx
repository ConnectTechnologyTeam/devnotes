import { Link } from "react-router-dom";
import {
  Calendar,
  Tag as TagIcon,
  User as UserIcon,
  Clock,
} from "lucide-react";
import { Article } from "@/lib/mockData";

interface ArticleMetadataProps {
  article: Article;
  readingTime: number;
}

/**
 * ArticleMetadata Component
 *
 * Displays article metadata information:
 * - Author name
 * - Category (with link)
 * - Publication date (responsive format)
 * - Estimated reading time
 */

export const ArticleMetadata = ({
  article,
  readingTime,
}: ArticleMetadataProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 article-detail-metadata text-muted-foreground">
      <div className="flex items-center space-x-2">
        <UserIcon className="h-4 w-4" />
        <span className="font-medium">{article.author.name}</span>
      </div>

      <div className="flex items-center space-x-2">
        <TagIcon className="h-4 w-4" />
        <Link
          to={`/categories/${article.category.slug}`}
          className="hover:text-primary transition-colors font-medium"
        >
          {article.category.name}
        </Link>
      </div>

      {article.publishedAt && (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="sm:hidden">
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
};
