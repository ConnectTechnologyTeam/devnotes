import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useArticles } from "./hooks/useArticles";
import {
  HeroSection,
  FeaturesSection,
  LatestArticlesSection,
} from "./components";

const Home = () => {
  const { user } = useAuth();
  const { articles, loading, error } = useArticles();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroSection user={user} />
      <FeaturesSection />
      <LatestArticlesSection articles={articles} />
    </div>
  );
};

export default Home;
