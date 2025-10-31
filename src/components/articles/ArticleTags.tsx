import { Tag as TagIcon } from "lucide-react";
import { Article } from "@/lib/mockData";

interface ArticleTagsProps {
  tags: Article["tags"];
}

/**
 * ArticleTags Component
 *
 * Displays article tags as non-clickable badges.
 * Returns null if no tags are provided.
 */

export const ArticleTags = ({ tags }: ArticleTagsProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="article-detail-tag inline-flex items-center px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground min-h-[32px]"
        >
          <TagIcon className="h-3 w-3 mr-1" />
          {tag.name}
        </span>
      ))}
    </div>
  );
};
