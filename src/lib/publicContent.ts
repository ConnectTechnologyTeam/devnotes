import matter from 'gray-matter';

const BASE = (import.meta as any).env?.BASE_URL || '/';

export async function loadContentIndex() {
  const res = await fetch(`${BASE}content-index.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error('content-index.json not found');
  const data = await res.json();
  return data.posts as Array<{ slug: string; title?: string; date?: string; description?: string; tags?: string[]; category?: string; author?: string; body: string; draft?: boolean }>;
}

export async function getPostFromIndex(slug: string) {
  const posts = await loadContentIndex();
  return posts.find(p => p.slug === slug) || null;
}

export async function listPublicPosts(owner: string, repo: string) {
  const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/content/posts`);
  if (!r.ok) return [] as any[];
  return (await r.json()).filter((i: any) => typeof i.name === 'string' && i.name.endsWith('.md'));
}

export async function loadPublicPostRaw(downloadUrl: string) {
  const res = await fetch(downloadUrl);
  if (!res.ok) throw new Error('Failed to load post');
  return res.text();
}

export function parseMd(raw: string) {
  const { data, content } = matter(raw);
  return { fm: data as any, body: content };
}


