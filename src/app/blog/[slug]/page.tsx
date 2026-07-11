import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import { getBlogPost } from "@/lib/blog";
import { postsDirectory, projectsDirectory } from "@/lib/types";
import { estimateReadTime, formatDate } from "@/lib/utils";
import MarkdownContent from "@/app/components/blog/MarkdownContent";
import Footer from "@/app/components/Footer";

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
    <main className="animate-fade mx-auto w-full max-w-2xl px-6 pt-14 md:pt-20 pb-16">
      <Link
        href="/blog"
        className="text-[13px] text-muted underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors"
      >
        ← Blog
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl text-foreground mt-8">
        {postData.title}
      </h1>
      <p className="mt-4 text-[13px] text-muted">
        {formatDate(postData.timestamp)} ·{" "}
        {estimateReadTime(postData.content)} min read
      </p>
      <p className="mt-4 text-[15px] leading-[1.6] text-muted">
        {postData.summary}
      </p>

      <Image
        src={postData.imageUrl}
        alt={postData.title}
        width={800}
        height={400}
        className="mt-8 w-full h-[400px] object-cover rounded-sm"
      />

      <div className="mt-8">
        <MarkdownContent content={postData.content} />
      </div>

      <Footer />
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
