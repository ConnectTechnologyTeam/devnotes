/**
 * Example usage of the typography configuration system
 *
 * This file demonstrates how to use the centralized typography
 * configuration in other components.
 */

import { typographyClasses } from "@/lib/typography";

// Example component using typography classes
export const ExampleComponent = () => {
  return (
    <div>
      {/* Using predefined CSS classes */}
      <h1 className={typographyClasses.articleTitle}>Article Title</h1>

      <div className={typographyClasses.articleMetadata}>
        Author and metadata information
      </div>

      <div className={typographyClasses.markdownP}>
        Paragraph content with consistent typography
      </div>

      {/* Using utility classes for custom sizing */}
      <button className={typographyClasses.buttonDelete}>Delete Action</button>
    </div>
  );
};

// Example of extending the typography system
export const customTypographyClasses = {
  ...typographyClasses,
  customHeading: "custom-heading",
  customText: "custom-text",
} as const;
