import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockArticleService } from '@/lib/mockData';
import { getPostBySlug, getAllUsers } from '@/lib/contentUtils';
import { getPostFromIndex } from '@/lib/publicContent';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { UserBadge } from '@/components/UserBadge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  let initial = mockArticleService.getArticleById(id!);
  const [cmsArticle, setCmsArticle] = useState<typeof initial | null>(initial);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (initial) return; // already have mock article
    (async () => {
      // Try static index first for zero-auth public
      const indexed = await getPostFromIndex(id!);
      if (indexed) {
        const users = await getAllUsers();
        const author = users.find(u => u.slug === indexed.author);
        const mapped = {
          id: id!,
          title: indexed.title,
          summary: indexed.description,
          content: indexed.body,
          status: 'PUBLISHED' as const,
          authorId: 'cms',
          author: { id: 'cms', email: author?.email || '', name: author?.name || 'Author', role: 'USER' as const, avatarUrl: author?.avatar },
          categoryId: 'cms',
          category: { id: 'cms', name: (indexed.category || 'General') as any, slug: String(indexed.category || 'general').toLowerCase() },
          tags: (indexed.tags || []).map((t, i) => ({ id: String(i), name: t as any, slug: String(t).toLowerCase() })),
          publishedAt: indexed.date,
          createdAt: indexed.date,
          updatedAt: indexed.date,
        };
        setCmsArticle(mapped as any);
        return;
      }
      const post = await getPostBySlug(id!);
      if (!post) return setCmsArticle(null);
      const users = await getAllUsers();
      const author = users.find(u => u.slug === post.author);
      const mapped = {
        id: id!,
        title: post.title,
        summary: post.description,
        content: post.body,
        status: 'PUBLISHED' as const,
        authorId: 'cms',
        author: { id: 'cms', email: author?.email || '', name: author?.name || 'Author', role: 'USER' as const, avatarUrl: author?.avatar },
        categoryId: 'cms',
        category: { id: 'cms', name: post.category || 'General', slug: (post.category || 'general').toLowerCase() },
        tags: (post.tags || []).map((t, i) => ({ id: String(i), name: t, slug: String(t).toLowerCase() })),
        publishedAt: post.date,
        createdAt: post.date,
        updatedAt: post.date,
      };
      setCmsArticle(mapped as any);
    })();
  }, [id]);

  const article = initial ?? cmsArticle ?? undefined;

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
      
      <article className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Article Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors min-h-[44px]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{article.author.name}</span>
              </div>
              
              <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                <div className="flex items-center space-x-1">
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                  <Link 
                    to={`/categories/${article.category.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {article.category.name}
                  </Link>
                </div>
                
                {article.publishedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <span className="sm:hidden">{new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {article.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link 
                  key={tag.id} 
                  to={`/tags/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm hover:bg-secondary-hover transition-colors min-h-[32px]"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="prose prose-sm sm:prose-lg max-w-none sm:mx-auto overflow-hidden">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            // Allow data URIs for images inserted as base64
            urlTransform={(url) => url}
            components={{
              a: ({ href, children }) => (
                <a href={href as string} className="text-primary hover:underline break-words" target="_blank" rel="noreferrer">
                  {children}
                </a>
              ),
              h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 mt-6 sm:mt-8 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-3 sm:mb-4 leading-relaxed text-foreground text-sm sm:text-base">{children}</p>,
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return <code className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono">{children}</code>;
                }
                return <code className={className}>{children}</code>;
              },
              pre: ({ children }) => <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto mb-3 sm:mb-4 text-sm">{children}</pre>,
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
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="flex items-center justify-center sm:justify-start">
              <UserBadge name={article.author.name} avatarUrl={article.author.avatarUrl} />
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
              {/* Action buttons: Edit (author) and Delete (admin) */}
              {user && article.authorId === user.id && (
                <Link to={`/articles/${article.id}/edit`} className="flex-1 sm:flex-initial">
                  <Button className="w-full sm:w-auto min-h-[44px]">Edit</Button>
                </Link>
              )}
              {user && user.role === 'ADMIN' && (
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto min-h-[44px]"
                  onClick={async () => {
                    try {
                      // Check if it's a mock article or CMS article
                      if (initial) {
                        // It's a mock article, use mockArticleService
                        await mockArticleService.deleteArticle(article.id);
                      } else {
                        // It's a CMS article, we need to delete the markdown file
                        // For now, show a message that CMS articles can't be deleted from here
                        toast({
                          title: 'CMS Article',
                          description: 'This article is managed by CMS. Please delete it from the CMS admin panel.',
                          variant: 'destructive',
                        });
                        return;
                      }
                      
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
              <Link to="/" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">More Articles</span>
                  <span className="sm:hidden">Back</span>
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