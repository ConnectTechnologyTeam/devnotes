import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArticleList } from "@/components/ArticleList";
import { Article } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";

interface LatestArticlesSectionProps {
  articles: Article[];
}

const LatestArticlesSection = ({ articles }: LatestArticlesSectionProps) => {
  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Latest Articles
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Stay up-to-date with the latest insights and tutorials from our
            community of developers.
          </p>
        </div>

        <ArticleList
          articles={articles}
          emptyMessage="No articles published yet."
        />

        {articles.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <Link to="/articles">
              <Button variant="outline" size="lg" className="min-h-[44px]">
                View All Articles{" "}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestArticlesSection;
