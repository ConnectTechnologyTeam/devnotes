import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockArticleService } from '@/lib/mockData';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const article = mockArticleService.getArticleById(id!);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <Link 
                  to={`/categories/${article.category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {article.category.name}
                </Link>
              </div>
              
              {article.publishedAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link 
                  key={tag.id} 
                  to={`/tags/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary-hover transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
                }
                return <code className={className}>{children}</code>;
              },
              pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">{children}</blockquote>,
              ul: ({ children }) => <ul className="mb-4 ml-6 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="mb-4 ml-6 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
        
        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{article.author.name}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Action buttons: Edit (author) and Delete (admin) */}
              {user && article.authorId === user.id && (
                <Link to={`/articles/${article.id}/edit`}>
                  <Button className="mr-2">Edit</Button>
                </Link>
              )}
              {user && user.role === 'ADMIN' && (
                <Button
                  variant="destructive"
                  className="mr-2"
                  onClick={async () => {
                    try {
                      await mockArticleService.deleteArticle(article.id);
                      toast({
                        title: 'Article deleted',
                        description: 'The article has been removed successfully.',
                      });
                      navigate('/');
                    } catch (error) {
                      toast({
                        title: 'Delete failed',
                        description: 'Could not delete the article. Please try again.',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              )}
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  More Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;