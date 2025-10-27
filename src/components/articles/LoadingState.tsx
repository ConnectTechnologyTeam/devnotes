import { ArrowLeft } from "lucide-react";

interface LoadingStateProps {
  onBack: () => void;
}

export const LoadingState = ({ onBack }: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Skeleton Navigation */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="nav-back inline-flex items-center mb-4 sm:mb-6 min-h-[44px] hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          {/* Skeleton Metadata */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
            </div>

            {/* Skeleton Title */}
            <div className="space-y-2">
              <div className="h-12 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-12 w-3/4 bg-muted rounded animate-pulse"></div>
            </div>

            {/* Skeleton Tags */}
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-muted rounded-full animate-pulse"></div>
              <div className="h-8 w-20 bg-muted rounded-full animate-pulse"></div>
              <div className="h-8 w-14 bg-muted rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Content */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
        </div>
      </article>
    </div>
  );
};
