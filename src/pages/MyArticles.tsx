import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockArticleService, mockAuth } from '@/lib/mockData';
import { PenTool, Plus } from 'lucide-react';

const MyArticles = () => {
  const user = mockAuth.getCurrentUser();
  const [activeTab, setActiveTab] = useState('all');

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">Please log in to view your articles.</p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const myArticles = mockArticleService.getArticlesByAuthor(user.id);
  
  const articlesByStatus = {
    all: myArticles,
    draft: myArticles.filter(a => a.status === 'DRAFT'),
    pending: myArticles.filter(a => a.status === 'PENDING'),
    published: myArticles.filter(a => a.status === 'PUBLISHED'),
    rejected: myArticles.filter(a => a.status === 'REJECTED'),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Articles</h1>
            <p className="text-muted-foreground">
              Manage and track your published and draft articles
            </p>
          </div>
          
          <Link to="/create">
            <Button className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Article</span>
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({myArticles.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({articlesByStatus.draft.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({articlesByStatus.pending.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published ({articlesByStatus.published.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({articlesByStatus.rejected.length})
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="all">
              <ArticleList 
                articles={articlesByStatus.all}
                showStatus={true}
                emptyMessage="You haven't written any articles yet. Start by creating your first article!"
              />
            </TabsContent>
            
            <TabsContent value="draft">
              <ArticleList 
                articles={articlesByStatus.draft}
                showStatus={true}
                emptyMessage="No draft articles. Your saved drafts will appear here."
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <ArticleList 
                articles={articlesByStatus.pending}
                showStatus={true}
                emptyMessage="No articles pending review. Submit an article for review to see it here."
              />
            </TabsContent>
            
            <TabsContent value="published">
              <ArticleList 
                articles={articlesByStatus.published}
                showStatus={true}
                emptyMessage="No published articles yet. Keep writing and get your articles approved!"
              />
            </TabsContent>
            
            <TabsContent value="rejected">
              <div className="space-y-6">
                <ArticleList 
                  articles={articlesByStatus.rejected}
                  showStatus={true}
                  emptyMessage="No rejected articles. Articles that need revision will appear here."
                />
                
                {articlesByStatus.rejected.length > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">📝 What to do with rejected articles:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Review the feedback provided by our editors</li>
                      <li>• Make the necessary improvements to your content</li>
                      <li>• Update your article and resubmit for review</li>
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        {myArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <PenTool className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start writing your first article</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Share your knowledge with the developer community. Write about Java, Spring, microservices, or any technical topic you're passionate about.
            </p>
            <Link to="/create">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Article
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;