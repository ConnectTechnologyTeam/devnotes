import matter from 'gray-matter';

const BASE = (import.meta as any).env?.BASE_URL || '/';

async function tryFetch(paths: string[]): Promise<Response> {
  for (const p of paths) {
    try {
      const res = await fetch(p, { cache: 'no-store' });
      if (res.ok) return res;
    } catch {}
  }
  throw new Error('content-index.json not found');
}

export async function loadContentIndex() {
  // For GitHub Pages project sites, the base is /<repo>/
  // Your site: https://connecttechnologyteam.github.io/devnotes/#/
  const repoBase = 'devnotes';
  const candidatePaths = [
    `/${repoBase}/content-index.json`,
    `${BASE}content-index.json`,
    './content-index.json',
    '/content-index.json',
  ];
  
  console.log('[loadContentIndex] Trying paths:', candidatePaths);
  
  try {
    const res = await tryFetch(candidatePaths);
    const data = await res.json();
    console.log('[loadContentIndex] Success, posts:', data.posts?.length || 0);
    return data.posts as Array<{ slug: string; title?: string; date?: string; description?: string; tags?: string[]; category?: string; author?: string; body: string; draft?: boolean }>;
  } catch (error) {
    console.error('[loadContentIndex] Failed to load:', error);
    throw error;
  }
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


