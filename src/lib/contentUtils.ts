/**
 * Content utilities for reading and processing Markdown content from the CMS
 * These functions help integrate Decap CMS content with your React app
 */

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
  featured_image?: string;
  body: string;
  draft: boolean;
}

export interface Page {
  slug: string;
  title: string;
  description?: string;
  body: string;
  draft: boolean;
}

/**
 * Get the base URL for content files
 * In production, this should point to your GitHub Pages URL
 * In development, you can use a local server or GitHub raw URLs
 */
const getContentBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    // In development, you might want to serve content locally
    // or use GitHub raw URLs for testing
    return 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main';
  }
  
  // In production, use your GitHub Pages URL
  return 'https://YOUR_USERNAME.github.io/YOUR_REPO_NAME';
};

/**
 * Fetch and parse a Markdown file from the content directory
 */
export const fetchMarkdownFile = async (path: string): Promise<string> => {
  try {
    const baseUrl = getContentBaseUrl();
    const response = await fetch(`${baseUrl}/${path}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    throw error;
  }
};

/**
 * Parse frontmatter from a Markdown file
 */
export const parseFrontmatter = (content: string): { frontmatter: Record<string, any>; body: string } => {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const [, frontmatterStr, body] = match;
  const frontmatter: Record<string, any> = {};
  
  // Simple YAML parsing (for basic use cases)
  // For production, consider using a proper YAML parser
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays (simple format: [item1, item2, item3])
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
      }
      
      // Parse booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body };
};

/**
 * Get all posts from the content/posts directory
 */
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    // In a real implementation, you might want to:
    // 1. Use GitHub API to list files in content/posts
    // 2. Cache the results
    // 3. Handle pagination
    
    // For now, return a hardcoded list or implement based on your needs
    const posts: Post[] = [];
    
    // Example: You could maintain a posts index file
    // or use GitHub API to discover posts dynamically
    const indexResponse = await fetchMarkdownFile('content/posts/index.md');
    // Parse the index file to get list of posts...
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Get a single post by slug
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    // Construct the file path based on your naming convention
    // This assumes posts are named like: YYYY-MM-DD-slug.md
    const content = await fetchMarkdownFile(`content/posts/${slug}.md`);
    const { frontmatter, body } = parseFrontmatter(content);
    
    return {
      slug,
      title: frontmatter.title || '',
      date: frontmatter.date || '',
      description: frontmatter.description || '',
      tags: frontmatter.tags || [],
      category: frontmatter.category || '',
      featured_image: frontmatter.featured_image,
      body,
      draft: frontmatter.draft || false,
    };
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
};

/**
 * Get all pages from the content/pages directory
 */
export const getAllPages = async (): Promise<Page[]> => {
  try {
    const pages: Page[] = [];
    // Similar to getAllPosts, implement based on your needs
    return pages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
};

/**
 * Get a single page by slug
 */
export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  try {
    const content = await fetchMarkdownFile(`content/pages/${slug}.md`);
    const { frontmatter, body } = parseFrontmatter(content);
    
    return {
      slug,
      title: frontmatter.title || '',
      description: frontmatter.description,
      body,
      draft: frontmatter.draft || false,
    };
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
};

/**
 * Build-time content loading (for static generation)
 * This is a placeholder for build-time content processing
 * You might want to implement this in your build process
 */
export const buildTimeContentLoader = {
  /**
   * Load all posts at build time
   * This would typically be called during the build process
   */
  loadAllPosts: async (): Promise<Post[]> => {
    // Implementation for build-time loading
    // This could read from the file system directly
    return [];
  },
  
  /**
   * Load all pages at build time
   */
  loadAllPages: async (): Promise<Page[]> => {
    // Implementation for build-time loading
    return [];
  },
};
