import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  const isNotFound = error === "Article not found";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h1 className="error-title mb-4">
            {isNotFound ? "Article Not Found" : "Oops! Something went wrong"}
          </h1>

          <p className="error-description mb-8">
            {isNotFound
              ? "The article you're looking for doesn't exist or may have been removed."
              : error ||
                "We encountered an error while loading the article. Please try again."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onRetry} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link to="/">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
