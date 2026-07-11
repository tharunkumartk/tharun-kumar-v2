import { notFound } from "next/navigation";
import Image from "next/image";
import fs from "fs";
import { getBlogPost } from "@/lib/blog";
import { postsDirectory, projectsDirectory } from "@/lib/types";
import { estimateReadTime, formatDate } from "@/lib/utils";
import BackButton from "@/app/components/blog/BackButton";
import MarkdownContent from "@/app/components/blog/MarkdownContent";
import FooterColumn from "@/app/components/landing/FooterColumn";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // First try to get the post from the blog directory
  let postData = getBlogPost(slug, postsDirectory, {
    suppressMissingWarning: true,
  });
  if (!postData) {
    // If not found, try to get the post from the projects directory
    postData = getBlogPost(slug, projectsDirectory);
  }

  // If still not found, return 404
  if (!postData) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16 py-16 space-y-16">
        <div className="flex items-center justify-between mb-16">
          <BackButton href="/blog" title="Blog" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row text-xs sm:text-sm text-stone-600 dark:text-stone-400 space-x-4 mt-auto ">
            <span>{formatDate(postData.timestamp)}</span>
            <span>{estimateReadTime(postData.content)} min read</span>
          </div>
          <h1
            className="font-regular text-stone-900 dark:text-stone-100 mb-2 opacity-0 animate-fadeIn text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              animationDelay: "0ms",
              animationFillMode: "forwards",
            }}
          >
            {postData.title}
          </h1>
          <div
            className="mt-4 text-stone-600 dark:text-stone-400 transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn text-center max-w-3xl "
            style={{
              fontSize: "18px",
              animationDelay: "200ms",
              animationFillMode: "forwards",
            }}
          >
            {postData.summary}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image
            src={postData.imageUrl}
            alt={postData.title}
            width={800}
            height={400}
            className="rounded-xl flex-shrink-0 w-full h-[400px] object-cover opacity-0 animate-fadeIn"
            style={{
              animationDelay: "400ms",
              animationFillMode: "forwards",
            }}
          />
        </div>
        <div
          className="opacity-0 animate-fadeIn"
          style={{
            animationDelay: "600ms",
            animationFillMode: "forwards",
          }}
        >
          <MarkdownContent content={postData.content} />
        </div>
        <FooterColumn />
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug, postsDirectory, {
    suppressMissingWarning: true,
  });
  let postData = post;
  if (!post) {
    postData = getBlogPost(slug, projectsDirectory);
  }

  if (!postData) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: postData.title,
    description: postData.summary,
    openGraph: {
      title: postData.title,
      description: postData.summary,
      images: [postData.imageUrl],
    },
  };
}

// Generate static params for all blog posts and projects at build time
export async function generateStaticParams() {
  const blogSlugs = fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));

  const projectSlugs = fs
    .readdirSync(projectsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));

  return [...blogSlugs, ...projectSlugs].map((slug) => ({ slug }));
}

// Revalidate pages every hour for ISR (Incremental Static Regeneration)
export const revalidate = 3600;
