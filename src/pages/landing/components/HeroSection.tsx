import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-devnotes.jpg";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface HeroSectionProps {
  user: User | null;
}

const HeroSection = ({ user }: HeroSectionProps) => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 bg-gradient-hero overflow-hidden min-h-[320px] sm:min-h-[400px]">
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="DevNotes Hero"
          className="w-full h-full object-cover opacity-30"
          loading="lazy"
        />
      </div>

      <div className="relative container mx-auto text-center text-white flex flex-col justify-center min-h-[280px] sm:min-h-[360px]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
          Developer Knowledge
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-200">
            Simplified
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed px-4">
          Discover in-depth articles on Java, Spring Framework, Microservices,
          and modern software architecture. Written by developers, for
          developers.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center px-4">
          <Link to={user ? "/create" : "/login"} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-3 text-base sm:text-lg min-h-[44px]"
            >
              Start Writing{" "}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Link to="/categories" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white bg-transparent px-6 sm:px-8 py-3 text-base sm:text-lg min-h-[44px]"
            >
              Browse Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
