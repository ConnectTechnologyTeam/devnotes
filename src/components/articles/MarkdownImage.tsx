import { isValidImageUrl, processImageUrl } from "@/lib/articleContentUtils";

interface MarkdownImageProps {
  src?: string | null;
  alt?: string | null;
  [key: string]: unknown;
}

/**
 * Custom image component for markdown rendering
 * Handles URL processing, error handling, and lazy loading
 */
export const MarkdownImage = ({ src, alt, ...props }: MarkdownImageProps) => {
  const rawUrl = (src || "").trim();

  if (!rawUrl) {
    return null;
  }

  const processedUrl = processImageUrl(rawUrl);

  // Validate URL format (only warn in development)
  if (!isValidImageUrl(processedUrl) && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn("Invalid image URL format:", processedUrl);
  }

  // SVG placeholder for failed image loads
  const placeholderSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = placeholderSvg;

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("Failed to load image:", processedUrl);
    }
  };

  return (
    <img
      {...props}
      src={processedUrl}
      alt={alt || "Article image"}
      className="markdown-image my-4 mx-auto rounded-lg shadow-md max-w-full h-auto block"
      loading="lazy"
      onError={handleError}
    />
  );
};
