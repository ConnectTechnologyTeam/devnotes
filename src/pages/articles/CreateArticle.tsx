/**
 * CreateArticle Component
 *
 * This component has been updated to use API services instead of mock data.
 * All data (categories, tags, articles) is now fetched from the JSON Server API.
 *
 * To switch to a real production service:
 * 1. Update API_CONFIG.BASE_URL in src/lib/articleService.ts
 * 2. Ensure your production API follows the same endpoint structure:
 *    - GET /api/categories - Returns array of categories
 *    - GET /api/tags - Returns array of tags
 *    - POST /api/posts - Creates new article/post
 * 3. Update API_CONFIG.USE_MOCK_SERVICE to false for production
 *
 * The component handles loading states and error handling automatically.
 */
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  articleService,
  categoryService,
  tagService,
  ApiError,
  CreatePostMultipartRequest,
} from "@/lib/articleService";
import { Category, Tag } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Save, Send, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownEditor } from "@/components/editor";

// Constants
const DEFAULT_CONTENT = "No content provided";

// Types
interface ArticleFormData {
  title: string;
  content: string;
  categoryId: string;
  selectedTags: string[];
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  // API data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, File>>(
    new Map()
  );

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch categories and tags from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        // Fetch categories and tags in parallel
        const [categoriesData, tagsData] = await Promise.all([
          categoryService.getCategories(),
          tagService.getTags(),
        ]);

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch categories and tags:", error);
        toast({
          title: "Error loading data",
          description:
            "Failed to load categories and tags. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Validation functions
  const validateDraftForm = useCallback((): ValidationResult => {
    if (!title.trim()) {
      return {
        isValid: false,
        message: "Please enter a title for your article.",
      };
    }
    return { isValid: true };
  }, [title]);

  const validateSubmitForm = useCallback((): ValidationResult => {
    if (!title.trim()) {
      return {
        isValid: false,
        message: "Please enter a title for your article.",
      };
    }
    if (!content.trim()) {
      return {
        isValid: false,
        message: "Please enter content for your article.",
      };
    }
    if (!categoryId) {
      return {
        isValid: false,
        message: "Please select a category for your article.",
      };
    }
    return { isValid: true };
  }, [title, content, categoryId]);

  // Memoized derived data
  const formData: ArticleFormData = useMemo(
    () => ({
      title,
      content,
      categoryId,
      selectedTags,
    }),
    [title, content, categoryId, selectedTags]
  );

  // Event handlers with memoization
  const handleTagChange = useCallback((tagId: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tagId] : prev.filter((id) => id !== tagId)
    );
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreview((prev) => !prev);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    // AuthGuard ensures user is always available when this component renders
    const validation = validateDraftForm();
    if (!validation.isValid) {
      toast({
        title: "Title required",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convert uploaded files Map to File array
      const filesArray = Array.from(uploadedFiles.values());

      const articleData: CreatePostMultipartRequest = {
        title: title.trim(),
        content: content.trim() || DEFAULT_CONTENT,
        categoryId:
          categoryId || (categories.length > 0 ? categories[0].id : ""),
        tagIds: selectedTags,
        submit: false, // false for draft
        files: filesArray,
      };

      await articleService.createArticleMultipart(articleData);

      toast({
        title: "Draft saved",
        description: "Your article has been saved as a draft.",
      });
      navigate("/my-articles");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save draft:", error);

      let errorMessage = "Failed to save draft. Please try again.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    validateDraftForm,
    title,
    content,
    categoryId,
    categories,
    selectedTags,
    uploadedFiles,
    navigate,
    toast,
  ]);

  const handleSubmitForReview = useCallback(async () => {
    const validation = validateSubmitForm();
    if (!validation.isValid) {
      toast({
        title: "Missing information",
        description:
          validation.message ||
          "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convert uploaded files Map to File array
      const filesArray = Array.from(uploadedFiles.values());

      const articleData: CreatePostMultipartRequest = {
        title: title.trim(),
        content: content.trim(),
        categoryId:
          categoryId || (categories.length > 0 ? categories[0].id : ""),
        tagIds: selectedTags,
        submit: true, // true for submit for review
        files: filesArray,
      };

      await articleService.createArticleMultipart(articleData);

      toast({
        title: "Article submitted",
        description: "Your article has been submitted for review.",
      });
      navigate("/my-articles");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to submit article:", error);

      let errorMessage = "Failed to submit article. Please try again.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    validateSubmitForm,
    title,
    content,
    categoryId,
    categories,
    selectedTags,
    uploadedFiles,
    navigate,
    toast,
  ]);

  // Memoized input handlers
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    []
  );

  // Memoized markdown components
  const markdownComponents = useMemo(
    () => ({
      a: ({
        href,
        children,
      }: {
        href?: string;
        children?: React.ReactNode;
      }) => (
        <a
          href={href as string}
          className="text-primary hover:underline break-words"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      ),
    }),
    []
  );

  // Show loading state while fetching data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading form data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create Article</h1>
            <p className="text-muted-foreground">
              Share your knowledge with the developer community
            </p>
          </div>

          <Button
            variant="outline"
            onClick={togglePreview}
            className="space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{isPreview ? "Edit" : "Preview"}</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isPreview ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter article title"
                        value={title}
                        onChange={handleTitleChange}
                        className="text-lg"
                      />
                    </div>

                    <MarkdownEditor
                      value={content}
                      onChange={setContent}
                      onFilesChange={setUploadedFiles}
                      placeholder="Write your article content here using Markdown..."
                      label="Content * (Markdown supported)"
                      rows={20}
                    />
                  </>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-4">
                        {title || "Article Title"}
                      </h1>
                    </div>

                    <div className="prose prose-lg mx-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        urlTransform={(url) => url}
                        components={markdownComponents}
                      >
                        {content || "Article content will appear here..."}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Tags</Label>
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag.id}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={(checked) =>
                            handleTagChange(tag.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={tag.id} className="text-sm">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="w-full space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Saving..." : "Save Draft"}</span>
                </Button>

                <Button
                  onClick={handleSubmitForReview}
                  disabled={loading}
                  className="w-full space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? "Submitting..." : "Submit for Review"}</span>
                </Button>

                <div className="text-xs text-muted-foreground mt-4">
                  * Required fields must be completed before submission
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
