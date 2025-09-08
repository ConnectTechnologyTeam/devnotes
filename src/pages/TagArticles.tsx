import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { mockArticleService, mockTags } from '@/lib/mockData';

const TagArticles = () => {
  const { slug } = useParams<{ slug: string }>();
  const tag = mockTags.find(t => t.slug === slug);
  const articles = mockArticleService
    .getPublishedArticles()
    .filter(a => a.tags.some(t => t.slug === slug));

  if (!tag) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Tag not found</h1>
          <Link to="/tags" className="text-primary underline">Back to Tags</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">#{tag.name} Articles</h1>
        <ArticleList articles={articles} emptyMessage="No articles for this tag yet." />
      </div>
    </div>
  );
};

export default TagArticles;



