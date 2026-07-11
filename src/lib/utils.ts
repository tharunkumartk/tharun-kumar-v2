export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const startYear = start.getFullYear().toString().slice(-2);

  if (endDate === "present") {
    return `${startMonth} ${startYear} - present`;
  }

  const end = new Date(endDate);
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const endYear = end.getFullYear().toString().slice(-2);

  const startFormatted = `${startMonth} ${startYear}`;
  const endFormatted = `${endMonth} ${endYear}`;

  if (startFormatted === endFormatted) {
    return startFormatted;
  }

  return `${startFormatted} - ${endFormatted}`;
}

// Helper function to estimate read time
export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to format date
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// CDN configuration
export const CDN_BASE_URL =
  "https://ydfksaipdlqazgcsrdlm.supabase.co/storage/v1/object/public/web-images";

/**
 * Transforms local image URLs to CDN URLs
 * @param imageUrl - The original image URL (can be relative or absolute)
 * @returns The transformed CDN URL
 */
export function transformImageUrl(imageUrl: string): string {
  if (!imageUrl) return imageUrl;

  // If it's already a full URL (http/https), return as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Remove leading slash if present
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;

  // Combine CDN base URL with the image path
  return `${CDN_BASE_URL}/${cleanPath}`;
}

/**
 * Transforms all image URLs in markdown content to use CDN
 * @param content - The markdown content
 * @returns The content with transformed image URLs
 */
export function transformMarkdownImages(content: string): string {
  if (!content) return content;

  // Regex to match markdown image syntax: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  return content.replace(imageRegex, (match, alt, url) => {
    const transformedUrl = transformImageUrl(url);
    return `![${alt}](${transformedUrl})`;
  });
}
