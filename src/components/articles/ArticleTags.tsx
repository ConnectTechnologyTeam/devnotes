import { Link } from "react-router-dom";
import { Tag as TagIcon } from "lucide-react";
import { Article } from "@/lib/mockData";

interface ArticleTagsProps {
  tags: Article["tags"];
}

export const ArticleTags = ({ tags }: ArticleTagsProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          to={`/tags/${tag.slug}`}
          className="article-detail-tag inline-flex items-center px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary-hover transition-colors min-h-[32px] hover:scale-105 transform"
        >
          <TagIcon className="h-3 w-3 mr-1" />
          {tag.name}
        </Link>
      ))}
    </div>
  );
};
