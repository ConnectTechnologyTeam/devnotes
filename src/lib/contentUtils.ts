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
  author?: string; // slug of user
}

export interface Page {
  slug: string;
  title: string;
  description?: string;
  body: string;
  draft: boolean;
}

export interface UserDoc {
  slug: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  github?: string;
  role?: string;
}

/**
 * Get the base URL for content files
 * In production, this should point to your GitHub Pages URL
 * In development, you can use a local server or GitHub raw URLs
 */
const getContentBaseUrl = (): string => {
  // For GitHub Pages project sites, use the repo name as base path
  return '/devnotes';
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
        frontmatter[key] = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
        return;
      }
      
      // Parse booleans
      if (value === 'true') {
        frontmatter[key] = true;
        return;
      }
      if (value === 'false') {
        frontmatter[key] = false;
        return;
      }
      
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
    // Simple heuristic: try to fetch a manifest if present; otherwise return []
    // You can generate content/posts/manifest.json from CMS or CI if needed.
    const baseUrl = getContentBaseUrl();
    const resp = await fetch(`${baseUrl}/content/posts/manifest.json`);
    if (!resp.ok) return [];
    const items: { slug: string; path: string }[] = await resp.json();
    const posts: Post[] = [];
    for (const item of items) {
      const md = await fetchMarkdownFile(item.path);
      const { frontmatter, body } = parseFrontmatter(md);
      posts.push({
        slug: item.slug,
        title: frontmatter.title || '',
        date: frontmatter.date || '',
        description: frontmatter.description || '',
        tags: frontmatter.tags || [],
        category: frontmatter.category || '',
        featured_image: frontmatter.featured_image,
        body,
        draft: !!frontmatter.draft,
        author: frontmatter.author,
      });
    }
    return posts.filter(p => !p.draft);
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
    // Prefer manifest lookup for portability
    try {
      const baseUrl = getContentBaseUrl();
      const resp = await fetch(`${baseUrl}/content/posts/manifest.json`);
      if (resp.ok) {
        const items: { slug: string; path: string }[] = await resp.json();
        const found = items.find(i => i.slug === slug);
        if (found) {
          const content = await fetchMarkdownFile(found.path);
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
            draft: !!frontmatter.draft,
            author: frontmatter.author,
          };
        }
      }
    } catch {}

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
      author: frontmatter.author,
    };
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
};

/**
 * Load users (authors) from CMS as JSON manifest for quick client-side mapping.
 * Expected manifest format: [{ slug, name, email?, avatar?, bio? }]
 */
export const getAllUsers = async (): Promise<UserDoc[]> => {
  try {
    const baseUrl = getContentBaseUrl();
    const resp = await fetch(`${baseUrl}/content/users/manifest.json`);
    if (!resp.ok) {
      console.log('[getAllUsers] No user manifest found, returning empty array');
      return [];
    }
    const users = await resp.json();
    console.log('[getAllUsers] Loaded users:', users.length);
    return users;
  } catch (e) {
    console.log('[getAllUsers] Error fetching users (this is normal if no users exist):', e);
    return [];
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

