import { Code, Lightbulb, BookOpen } from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Code,
    title: "Technical Deep Dives",
    description:
      "Comprehensive tutorials and guides on Java, Spring, microservices, and enterprise architecture patterns.",
  },
  {
    icon: Lightbulb,
    title: "Best Practices",
    description:
      "Learn from industry experts and discover proven patterns for building scalable, maintainable software.",
  },
  {
    icon: BookOpen,
    title: "Quality Content",
    description:
      "All articles go through a review process to ensure high-quality, accurate, and up-to-date content.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-4 sm:p-6 bg-background/50 rounded-lg backdrop-blur-sm"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
