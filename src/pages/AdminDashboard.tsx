import { useState } from 'react';
import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockArticles, mockAuth, mockCategories, mockTags } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Users, FileText, Tag, Folder } from 'lucide-react';

const AdminDashboard = () => {
  const user = mockAuth.getCurrentUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const pendingArticles = mockArticles.filter(article => article.status === 'PENDING');
  const publishedArticles = mockArticles.filter(article => article.status === 'PUBLISHED');
  const totalArticles = mockArticles.length;

  const handleApprove = (articleId: string) => {
    toast({
      title: "Article approved",
      description: "The article has been published successfully.",
    });
  };

  const handleReject = (articleId: string) => {
    toast({
      title: "Article rejected",
      description: "The article has been rejected and feedback sent to the author.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage articles, categories, and platform content
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="review">
              Review Queue ({pendingArticles.length})
            </TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalArticles}</p>
                        <p className="text-sm text-muted-foreground">Total Articles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{pendingArticles.length}</p>
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{publishedArticles.length}</p>
                        <p className="text-sm text-muted-foreground">Published</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{mockCategories.length}</p>
                        <p className="text-sm text-muted-foreground">Categories</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockArticles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className={`status-badge status-${article.status.toLowerCase()}`}>
                            {article.status}
                          </Badge>
                          <div>
                            <p className="font-medium">{article.title}</p>
                            <p className="text-sm text-muted-foreground">by {article.author.name}</p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review Queue Tab */}
            <TabsContent value="review">
              <div className="space-y-6">
                {pendingArticles.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">
                        No articles pending review at the moment.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingArticles.map((article) => (
                    <Card key={article.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl">{article.title}</CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>by {article.author.name}</span>
                              <span>•</span>
                              <span>{article.category.name}</span>
                              <span>•</span>
                              <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge className="status-badge status-pending">
                            PENDING
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {article.summary}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {article.tags.map((tag) => (
                            <Badge key={tag.id} variant="secondary">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Button 
                            onClick={() => handleApprove(article.id)}
                            className="space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </Button>
                          
                          <Button 
                            variant="destructive"
                            onClick={() => handleReject(article.id)}
                            className="space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </Button>
                          
                          <Button variant="outline">
                            View Full Article
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Categories</CardTitle>
                  <Button>Add Category</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockCategories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Folder className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">/{category.slug}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tags Tab */}
            <TabsContent value="tags">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Tags</CardTitle>
                  <Button>Add Tag</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockTags.map((tag) => (
                      <div key={tag.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Tag className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{tag.name}</p>
                            <p className="text-sm text-muted-foreground">/{tag.slug}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;