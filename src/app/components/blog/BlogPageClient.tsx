"use client";

import Link from "next/link";
import Footer from "../Footer";
import { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useBlogFilters } from "./blogHooks";
import SortDropdown from "./SortDropdown";

const underlineClass =
  "underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors";
const linkClass = `text-accent ${underlineClass}`;
const mutedLinkClass = `text-muted ${underlineClass}`;

interface BlogPageClientProps {
  posts: BlogPost[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  const {
    selectedTags,
    sortOrder,
    setSortOrder,
    filteredAndSortedPosts,
    handleClearFilters,
  } = useBlogFilters(posts);

  return (
    <main className="animate-fade mx-auto w-full max-w-2xl px-6 pt-14 md:pt-20 pb-16">
      <Link href="/" className={`text-[13px] ${mutedLinkClass}`}>
        ← Home
      </Link>

      <h1 className="font-serif text-4xl text-foreground mt-8">All Projects</h1>

      {/* Subtitle + Sort — inline on desktop, stacked on mobile */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <p className="text-[15px] leading-[1.6] text-subtle">
          Some of the interesting projects I&apos;ve worked on
        </p>
        <SortDropdown value={sortOrder} onChange={setSortOrder} />
      </div>

      {/* Post list */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="mt-10">
          <p className="text-[15px] leading-[1.6] text-muted">
            {selectedTags.length > 0
              ? "No posts found with the selected tags."
              : "No posts available."}
          </p>
          {selectedTags.length > 0 && (
            <button
              onClick={handleClearFilters}
              className={`mt-4 text-[13px] ${mutedLinkClass}`}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {filteredAndSortedPosts.map((post) => (
            <article key={post.slug} className="relative">
              <h2 className="font-serif text-lg text-foreground">
                <Link href={`/blog/${post.slug}`} className={linkClass}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted">
                {post.summary}
              </p>
              <span className="absolute bottom-0 right-0 text-[12px] text-muted/60">
                {formatDate(post.timestamp)}
              </span>
            </article>
          ))}
        </div>
      )}

      <Footer />
    </main>
  );
}
