import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockCategories, mockTags } from "@/lib/mockData";
import { articleService, ApiError, PostResponse } from "@/lib/articleService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import MarkdownEditor from "@/components/MarkdownEditor";

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [article, setArticle] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch article data from API
  const fetchArticle = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const articleData = await articleService.getArticleById(id);
      setArticle(articleData);
      setTitle(articleData.title || "");
      setSummary(articleData.summary || "");
      setContent(articleData.content || "");
      setCategoryId(articleData.categoryId || "");
      setSelectedTags(Array.isArray(articleData.tags) ? articleData.tags : []);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch article:", error);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        </div>
      </div>
    );
  }

  // AuthGuard ensures user is authenticated, but we need to check authorization
  if (user.role !== "ADMIN" && user.id !== article.authorId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You do not have permission to edit this article.
          </p>
          <Button onClick={() => navigate("/my-articles")}>
            Back to My Articles
          </Button>
        </div>
      </div>
    );
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) setSelectedTags((prev) => [...prev, tagId]);
    else setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  const handleUpdate = async () => {
    try {
      await articleService.updateArticle(article.id, {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        categoryId: categoryId,
        tags: selectedTags, // Use tag IDs directly
      });

      toast({
        title: "Article updated",
        description: "Your changes have been saved.",
      });
      navigate(`/articles/${article.id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to update article:", error);

      let errorMessage = "Please try again.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Input
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <MarkdownEditor
              value={content}
              onChange={setContent}
              label="Content"
            />

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mockTags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag.id}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={(checked) =>
                        handleTagChange(tag.id, checked as boolean)
                      }
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditArticle;
