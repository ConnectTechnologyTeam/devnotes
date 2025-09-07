import matter from 'gray-matter';

const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || '';
const REPO_NAME = import.meta.env.VITE_REPO_NAME || '';
const API_ROOT = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

export type ListedItem = { name: string; download_url: string; path: string };

export async function listMarkdown(dir: 'content/users' | 'content/posts'): Promise<ListedItem[]> {
  try {
    // Skip GitHub API calls if environment variables are not set
    if (!REPO_OWNER || !REPO_NAME) {
      console.log('[listMarkdown] Skipping GitHub API call - missing environment variables');
      return [];
    }
    
    const res = await fetch(`${API_ROOT}/${dir}`);
    if (!res.ok) {
      console.log(`[listMarkdown] GitHub API call failed for ${dir}: ${res.status}`);
      return [];
    }
    const arr = await res.json();
    return (arr as any[])
      .filter(f => typeof f.name === 'string' && f.name.endsWith('.md'))
      .map(f => ({ name: f.name, download_url: f.download_url, path: f.path }));
  } catch (error) {
    console.log(`[listMarkdown] Error fetching ${dir}:`, error);
    return [];
  }
}

export async function loadMarkdown(download_url: string): Promise<{ frontmatter: any; body: string }> {
  const txt = await fetch(download_url).then(r => r.text());
  const parsed = matter(txt);
  return { frontmatter: parsed.data || {}, body: parsed.content || '' };
}

export async function loadJson(path: 'data/user-logins.json'): Promise<Record<string, any>> {
  try {
    // Skip GitHub API calls if environment variables are not set
    if (!REPO_OWNER || !REPO_NAME) {
      console.log('[loadJson] Skipping GitHub API call - missing environment variables');
      return {};
    }
    
    const res = await fetch(`${API_ROOT}/${path}`);
    if (!res.ok) {
      console.log(`[loadJson] GitHub API call failed for ${path}: ${res.status}`);
      return {};
    }
    const file = await res.json();
    const json = JSON.parse(atob(file.content));
    return json;
  } catch (error) {
    console.log(`[loadJson] Error fetching ${path}:`, error);
    return {};
  }
}


