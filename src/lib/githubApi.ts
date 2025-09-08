// GitHub API integration for creating markdown files when admin approves articles

interface GitHubFile {
  path: string;
  mode: '100644';
  type: 'blob';
  content: string;
}

interface GitHubCommit {
  message: string;
  content: string;
  sha?: string;
}

// This would need to be configured with GitHub token
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = 'connecttechnologyteam';
const REPO_NAME = 'devnotes';
const BRANCH = 'main';

export async function createMarkdownFile(article: any): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.warn('GitHub token not configured. Article will only be saved locally.');
    return false;
  }

  try {
    // Generate filename with date and slug
    const date = new Date().toISOString().split('T')[0];
    const slug = article.id || article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const filename = `${date}-${slug}.md`;
    const filePath = `content/posts/${filename}`;

    // Create markdown content
    const markdownContent = `---
title: "${article.title}"
date: ${date}
author: ${article.author.name}
description: "${article.summary}"
tags: [${article.tags.map((t: any) => `"${t.name}"`).join(', ')}]
category: "${article.category.name}"
draft: false
---

${article.content}
`;

    // Create file on GitHub
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Publish article: ${article.title}`,
          content: btoa(markdownContent), // Base64 encode
          branch: BRANCH,
        }),
      }
    );

    if (response.ok) {
      console.log(`Successfully created ${filePath} on GitHub`);
      return true;
    } else {
      const error = await response.text();
      console.error('Failed to create file on GitHub:', error);
      return false;
    }
  } catch (error) {
    console.error('Error creating markdown file:', error);
    return false;
  }
}

export async function updateContentIndex(): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    return false;
  }

  try {
    // This would trigger a rebuild of content-index.json
    // For now, we'll just return true as the build process handles this
    return true;
  } catch (error) {
    console.error('Error updating content index:', error);
    return false;
  }
}
