/**
 * Typography Configuration for DevNotes
 *
 * This file provides centralized typography settings that can be used
 * across different components and pages.
 */

export interface TypographyConfig {
  // Article Detail Page
  articleTitle: {
    mobile: string;
    sm: string;
    md: string;
    lg: string;
  };
  articleMetadata: {
    mobile: string;
    sm: string;
  };
  articleTag: {
    mobile: string;
    sm: string;
  };

  // Markdown Content
  markdown: {
    h1: { mobile: string; sm: string };
    h2: { mobile: string; sm: string };
    h3: { mobile: string; sm: string };
    p: { mobile: string; sm: string };
    code: { mobile: string; sm: string };
    pre: string;
  };

  // UI Elements
  errorTitle: string;
  loadingText: string;
  buttonDelete: string;
}

export const typographyConfig: TypographyConfig = {
  // Article Detail Page Typography - Balanced sizes for better readability
  articleTitle: {
    mobile: "2.5rem", // text-4xl
    sm: "3rem", // text-5xl
    md: "3.5rem", // text-6xl
    lg: "4rem", // text-7xl
  },

  articleMetadata: {
    mobile: "0.875rem", // text-sm
    sm: "1rem", // text-base
  },

  articleTag: {
    mobile: "0.875rem", // text-sm
    sm: "1rem", // text-base
  },

  // Markdown Content Typography - Balanced for comfortable reading
  markdown: {
    h1: {
      mobile: "2rem", // text-3xl
      sm: "2.25rem", // text-4xl
    },
    h2: {
      mobile: "1.75rem", // text-2xl
      sm: "2rem", // text-3xl
    },
    h3: {
      mobile: "1.5rem", // text-xl
      sm: "1.75rem", // text-2xl
    },
    p: {
      mobile: "1rem", // text-base
      sm: "1.125rem", // text-lg
    },
    code: {
      mobile: "0.875rem", // text-sm
      sm: "1rem", // text-base
    },
    pre: "1rem", // text-base
  },

  // UI Elements - Balanced for better readability
  errorTitle: "2.25rem", // text-4xl
  loadingText: "1rem", // text-base
  buttonDelete: "0.75rem", // text-xs
};

/**
 * Utility function to get responsive font size classes
 * @param config - Typography configuration object
 * @returns Tailwind CSS classes for responsive font sizes
 */
export function getResponsiveFontSize(config: {
  mobile: string;
  sm: string;
}): string {
  const mobileClass = `text-[${config.mobile}]`;
  const smClass = `sm:text-[${config.sm}]`;
  return `${mobileClass} ${smClass}`;
}

/**
 * Utility function to get CSS custom property values
 * @param config - Typography configuration object
 * @returns CSS custom property string
 */
export function getCSSCustomProperty(config: {
  mobile: string;
  sm: string;
}): string {
  return `var(--font-size-mobile, ${config.mobile})`;
}

/**
 * Predefined class combinations for common typography patterns
 */
export const typographyClasses = {
  // Article Detail
  articleTitle: "article-detail-title",
  articleMetadata: "article-detail-metadata",
  articleTag: "article-detail-tag",

  // Markdown Content
  markdownH1: "markdown-h1",
  markdownH2: "markdown-h2",
  markdownH3: "markdown-h3",
  markdownP: "markdown-p",
  markdownCode: "markdown-code",
  markdownPre: "markdown-pre",

  // UI Elements
  errorTitle: "error-title",
  errorDescription: "error-description",
  loadingText: "loading-text",
  buttonDelete: "btn-delete",
  navBack: "nav-back",
} as const;

/**
 * Type for typography class names
 */
export type TypographyClass =
  (typeof typographyClasses)[keyof typeof typographyClasses];
