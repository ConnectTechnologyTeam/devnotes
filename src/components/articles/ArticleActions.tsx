import { Button } from "@/components/ui/button";
import { Share2, Bookmark, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { articleService, ApiError } from "@/lib/articleService";
import { Article } from "@/lib/mockData";
import { User } from "@/lib/mockData";

interface ArticleActionsProps {
  article: Article;
  user: User | null;
}

export const ArticleActions = ({ article, user }: ArticleActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Bookmarked!",
      description: "Article has been saved to your bookmarks.",
    });
  };

  const handleDelete = async () => {
    try {
      await articleService.deleteArticle(article.id);
      toast({
        title: "Article deleted",
        description: "The article has been removed successfully.",
      });
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Could not delete the article. Please try again.";

      toast({
        title: "Delete failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="default"
        className="h-12 px-8"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      <Button
        variant="outline"
        size="default"
        className="h-12 px-8"
        onClick={handleBookmark}
      >
        <Bookmark className="h-4 w-4 mr-2" />
        Save
      </Button>

      {user?.role === "USER" && (
        <Button
          variant="destructive"
          size="default"
          className="btn-delete h-12 px-8"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      )}
    </div>
  );
};
