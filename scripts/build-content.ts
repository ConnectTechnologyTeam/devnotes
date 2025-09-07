import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const OUT_DIR = path.join(ROOT, 'public');
const OUT_FILE = path.join(OUT_DIR, 'content-index.json');

function readMd(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { fm: data as any, body: content };
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No content/posts directory; skipping content index generation.');
    return;
  }
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const items = files.map((f) => {
    const { fm, body } = readMd(path.join(POSTS_DIR, f));
    const slug = f.replace(/\.md$/, '');
    return { slug, ...fm, body };
  });
  const published = items.filter((p) => !p.draft);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ generatedAt: new Date().toISOString(), posts: published }, null, 2),
    'utf8'
  );
  console.log('Wrote', OUT_FILE, 'posts:', published.length);
}

main();


