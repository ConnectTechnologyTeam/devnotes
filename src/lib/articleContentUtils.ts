/**
 * Utility functions for processing article content
 * Handles transformation between indexed placeholders and image URLs
 */

/**
 * Processes article content by replacing indexed placeholders with markdown image tags
 *
 * @param content - The article content with indexed placeholders like "${0}", "${1}"
 * @param images - Array of image URLs corresponding to the placeholders
 * @returns Processed content with markdown image tags
 *
 * @example
 * ```ts
 * processContentWithImageUrls("Hello ${0}", ["https://example.com/image.png"])
 * // Returns: "Hello ![Image](<https://example.com/image.png>)"
 * ```
 */
export const processContentWithImageUrls = (
  content: string,
  images?: string[]
): string => {
  if (!images || images.length === 0) {
    return content;
  }

  // Replace all indexed placeholders like ${0}, ${1}, ${2}, etc.
  return content.replace(/\$\{(\d+)\}/g, (match, indexStr) => {
    const index = parseInt(indexStr, 10);

    // Validate index is within bounds
    if (index >= 0 && index < images.length && images[index]) {
      let imageUrl = images[index];

      // Clean up URL - remove leading @ if present and trim whitespace
      imageUrl = imageUrl.replace(/^@/, "").trim();

      // Wrap URL in angle brackets to ensure ReactMarkdown parses it correctly as an image
      // This is especially important for URLs with special characters (encoded spaces, etc.)
      return `![Image](<${imageUrl}>)`;
    }

    // If index is out of bounds, return the original placeholder
    return match;
  });
};

/**
 * Validates and processes an image URL for markdown rendering
 *
 * @param imageUrl - The raw image URL from the API
 * @returns Processed URL ready for use in markdown or img src
 */
export const processImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";

  // Remove leading @ if present and trim whitespace
  return imageUrl.replace(/^@/, "").trim();
};

/**
 * Validates if a URL is a valid HTTP/HTTPS URL
 *
 * @param url - URL to validate
 * @returns True if URL starts with http:// or https://
 */
export const isValidImageUrl = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://");
};
