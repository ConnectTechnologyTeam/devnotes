import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticleList } from '@/components/ArticleList';
import { mockArticleService, mockCategories } from '@/lib/mockData';

const CategoryArticles = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = mockCategories.find(c => c.slug === slug);
  const articles = mockArticleService
    .getPublishedArticles()
    .filter(a => a.category.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category not found</h1>
          <Link to="/categories" className="text-primary underline">Back to Categories</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{category.name} Articles</h1>
        <ArticleList articles={articles} emptyMessage="No articles in this category yet." />
      </div>
    </div>
  );
};

export default CategoryArticles;



