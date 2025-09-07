import matter from 'gray-matter';

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


