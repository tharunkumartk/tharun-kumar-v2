import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import { WorkExperience } from "./types";

const workDirectory = path.join(process.cwd(), "content/work");

// Function to convert basic markdown to HTML (for simple formatting like line breaks)
function processMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";

  // Convert double line breaks to paragraph breaks
  // Convert single line breaks to <br> tags
  return markdown
    .trim()
    .split("\n\n")
    .map((paragraph) => paragraph.replace(/\n/g, "<br>"))
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

export const getAllWorkExperiences = cache((): WorkExperience[] => {
  // Get file names under /content/work
  const fileNames = fs.readdirSync(workDirectory);
  const allWorkData = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(workDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the work metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug and content
      return {
        slug,
        company: matterResult.data.company,
        position: matterResult.data.position,
        startDate: matterResult.data.startDate,
        endDate: matterResult.data.endDate,
        companyUrl: matterResult.data.companyUrl,
        skills: matterResult.data.skills,
        order: matterResult.data.order || 999,
        content: processMarkdownToHtml(matterResult.content),
      } as WorkExperience;
    });

  // Sort work experiences by end date (most recent first)
  return allWorkData.sort((a, b) => {
    // Handle "present" as the most recent date
    if (a.endDate === "present" && b.endDate === "present") return 0;
    if (a.endDate === "present") return -1;
    if (b.endDate === "present") return 1;

    // Parse dates and sort in descending order (most recent first)
    const dateA = new Date(a.endDate);
    const dateB = new Date(b.endDate);
    return dateB.getTime() - dateA.getTime();
  });
});

export const getWorkExperience = cache(
  (slug: string): WorkExperience | null => {
    try {
      const fullPath = path.join(workDirectory, `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the work metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug and content
      return {
        slug,
        company: matterResult.data.company,
        position: matterResult.data.position,
        startDate: matterResult.data.startDate,
        endDate: matterResult.data.endDate,
        companyUrl: matterResult.data.companyUrl,
        skills: matterResult.data.skills,
        order: matterResult.data.order || 999,
        content: processMarkdownToHtml(matterResult.content),
      } as WorkExperience;
    } catch (error) {
      console.error(`Error reading work experience ${slug}:`, error);
      return null;
    }
  }
);

export const getAllWorkSlugs = cache((): string[] => {
  const fileNames = fs.readdirSync(workDirectory);
  return fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
});
