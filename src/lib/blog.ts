import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import { BlogPost, postsDirectory } from "./types";
import { transformImageUrl } from "./utils";

export const getBlogPosts = cache((directory: string): BlogPost[] => {
  // Get file names under /content/blog
  const fileNames = fs.readdirSync(directory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(directory, fileName);
      if (!fs.existsSync(fullPath)) {
        console.warn(`File not found: ${fullPath}`);
        return null;
      }
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug and raw markdown content
      return {
        slug,
        title: matterResult.data.title,
        timestamp: matterResult.data.timestamp,
        tags: matterResult.data.tags,
        imageUrl: transformImageUrl(matterResult.data.imageUrl),
        previewImageUrl: matterResult.data.previewImageUrl
          ? transformImageUrl(matterResult.data.previewImageUrl)
          : undefined,
        featured: matterResult.data.featured || false,
        summary: matterResult.data.summary,
        content: matterResult.content,
      } as BlogPost;
    })
    .filter((post): post is BlogPost => post !== null);

  // Sort posts by featured first, then by timestamp (newest first)
  return allPostsData.sort((a, b) => {
    // If one is featured and the other isn't, featured one comes first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Otherwise, sort by timestamp
    if (a.timestamp < b.timestamp) {
      return 1;
    } else {
      return -1;
    }
  });
});

export const getBlogPost = cache(
  (
    slug: string,
    directory: string,
    options?: { suppressMissingWarning?: boolean }
  ): BlogPost | null => {
    try {
      const fullPath = path.join(directory, `${slug}.md`);
      if (!fs.existsSync(fullPath)) {
        if (!options?.suppressMissingWarning) {
          console.warn(`Blog post file not found: ${fullPath}`);
        }
        return null;
      }
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug and raw markdown content
      return {
        slug,
        title: matterResult.data.title,
        timestamp: matterResult.data.timestamp,
        tags: matterResult.data.tags,
        imageUrl: transformImageUrl(matterResult.data.imageUrl),
        previewImageUrl: matterResult.data.previewImageUrl
          ? transformImageUrl(matterResult.data.previewImageUrl)
          : undefined,
        featured: matterResult.data.featured || false,
        summary: matterResult.data.summary,
        content: matterResult.content,
      } as BlogPost;
    } catch (error) {
      console.error(`Error reading blog post ${slug}:`, error);
      return null;
    }
  }
);

export const getAllBlogSlugs = cache((): string[] => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
});
