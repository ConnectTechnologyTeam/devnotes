# Typography Configuration System

This directory contains a centralized typography configuration system for the DevNotes application.

## Files

- `src/styles/typography.css` - CSS classes and custom properties for typography
- `src/lib/typography.ts` - TypeScript configuration and utility functions
- `src/lib/typography-example.ts` - Example usage patterns

## Usage

### 1. Using CSS Classes

The easiest way to use the typography system is through predefined CSS classes:

```tsx
import { typographyClasses } from '@/lib/typography';

// Article titles
<h1 className={typographyClasses.articleTitle}>
  Article Title
</h1>

// Metadata text
<div className={typographyClasses.articleMetadata}>
  Author and category information
</div>

// Markdown content
<p className={typographyClasses.markdownP}>
  Paragraph content
</p>

// Error states
<h1 className={typographyClasses.errorTitle}>
  Error Message
</h1>
```

### 2. Direct CSS Classes

You can also use the CSS classes directly:

```tsx
<h1 className="article-detail-title">Article Title</h1>
<div className="article-detail-metadata">Metadata</div>
<p className="markdown-p">Content</p>
```

### 3. Configuration Values

Access the raw configuration values:

```tsx
import { typographyConfig } from "@/lib/typography";

console.log(typographyConfig.articleTitle.mobile); // "2rem"
console.log(typographyConfig.markdown.h1.sm); // "1.875rem"
```

## Available Classes

### Article Detail

- `article-detail-title` - Main article title
- `article-detail-metadata` - Author, category, date info
- `article-detail-tag` - Tag styling

### Markdown Content

- `markdown-h1` - H1 headings in markdown
- `markdown-h2` - H2 headings in markdown
- `markdown-h3` - H3 headings in markdown
- `markdown-p` - Paragraphs in markdown
- `markdown-code` - Inline code
- `markdown-pre` - Code blocks

### UI Elements

- `error-title` - Error page titles
- `error-description` - Error descriptions
- `loading-text` - Loading state text
- `btn-delete` - Delete button styling
- `nav-back` - Back navigation links

## Customization

### Adding New Typography Styles

1. **Add CSS classes** to `src/styles/typography.css`:

```css
.custom-heading {
  font-size: 1.5rem;
  font-weight: 600;
}

@media (min-width: 640px) {
  .custom-heading {
    font-size: 2rem;
  }
}
```

2. **Add TypeScript configuration** to `src/lib/typography.ts`:

```typescript
export const typographyClasses = {
  // ... existing classes
  customHeading: "custom-heading",
} as const;
```

3. **Use in components**:

```tsx
<h2 className={typographyClasses.customHeading}>Custom Heading</h2>
```

### Modifying Existing Styles

To modify existing typography, update the CSS custom properties in `src/styles/typography.css`:

```css
.article-detail {
  --article-title-mobile: 2.5rem; /* Changed from 2rem */
  --article-title-sm: 3.5rem; /* Changed from 3rem */
}
```

## Benefits

1. **Consistency** - All typography follows the same design system
2. **Maintainability** - Changes can be made in one place
3. **Responsiveness** - Built-in responsive behavior
4. **Type Safety** - TypeScript support for class names
5. **Reusability** - Easy to apply to new components
6. **Performance** - CSS classes are more efficient than inline styles

## Migration Guide

To migrate existing components to use this system:

1. Replace inline Tailwind classes with predefined CSS classes
2. Import `typographyClasses` from `@/lib/typography`
3. Test responsive behavior across different screen sizes
4. Update any custom typography to use the centralized system
