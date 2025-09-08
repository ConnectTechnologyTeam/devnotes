import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockArticleService, mockCategories, mockTags } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MarkdownEditor from '@/components/MarkdownEditor';

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const article = id ? mockArticleService.getArticleById(id) : null;

  const [title, setTitle] = useState(article?.title || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || '');
  const [categoryId, setCategoryId] = useState(article?.categoryId || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(article ? article.tags.map(t => t.id) : []);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.id !== article.authorId)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        </div>
      </div>
    );
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) setSelectedTags(prev => [...prev, tagId]);
    else setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const handleUpdate = async () => {
    try {
      const selectedCategory = mockCategories.find(cat => cat.id === categoryId) || mockCategories[0];
      const selectedTagsData = mockTags.filter(tag => selectedTags.includes(tag.id));

      await mockArticleService.updateArticle(article.id, {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        categoryId: selectedCategory.id,
        category: selectedCategory,
        tags: selectedTagsData,
      });

      toast({ title: 'Article updated', description: 'Your changes have been saved.' });
      navigate(`/articles/${article.id}`);
    } catch (e) {
      toast({ title: 'Update failed', description: 'Please try again.', variant: 'destructive' });
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
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
            </div>

            <MarkdownEditor value={content} onChange={setContent} label="Content" />

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mockTags.map(tag => (
                  <label key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag.id}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={(checked) => handleTagChange(tag.id, checked as boolean)}
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



