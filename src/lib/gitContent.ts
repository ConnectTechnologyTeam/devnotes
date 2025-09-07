import matter from 'gray-matter';

const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || '';
const REPO_NAME = import.meta.env.VITE_REPO_NAME || '';
const API_ROOT = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

export type ListedItem = { name: string; download_url: string; path: string };

export async function listMarkdown(dir: 'content/users' | 'content/posts'): Promise<ListedItem[]> {
  try {
    const res = await fetch(`${API_ROOT}/${dir}`);
    if (!res.ok) return [];
    const arr = await res.json();
    return (arr as any[])
      .filter(f => typeof f.name === 'string' && f.name.endsWith('.md'))
      .map(f => ({ name: f.name, download_url: f.download_url, path: f.path }));
  } catch {
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
    const res = await fetch(`${API_ROOT}/${path}`);
    if (!res.ok) return {};
    const file = await res.json();
    const json = JSON.parse(atob(file.content));
    return json;
  } catch {
    return {};
  }
}


