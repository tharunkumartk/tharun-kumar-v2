"use client";

import Link from "next/link";
import Footer from "../Footer";
import { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useBlogFilters } from "./blogHooks";
import SortDropdown from "./SortDropdown";

const linkClass =
  "underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors";

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
      <Link href="/" className={`text-[13px] text-muted ${linkClass}`}>
        ← Home
      </Link>

      <h1 className="font-serif text-4xl text-foreground mt-8">All Projects</h1>
      <p className="mt-4 text-[15px] leading-[1.6] text-muted">
        Some of the interesting projects I&apos;ve worked on
      </p>

      {/* Sort + count */}
      <div className="mt-4 flex items-baseline justify-between">
        <SortDropdown value={sortOrder} onChange={setSortOrder} />
        <p className="text-[13px] text-muted">
          {filteredAndSortedPosts.length} of {posts.length} posts
        </p>
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
              className={`mt-4 text-[13px] text-muted ${linkClass}`}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {filteredAndSortedPosts.map((post) => (
            <article key={post.slug}>
              <h2 className="font-serif text-lg text-foreground">
                <Link href={`/blog/${post.slug}`} className={linkClass}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                {formatDate(post.timestamp)}
              </p>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted">
                {post.summary}
              </p>
            </article>
          ))}
        </div>
      )}

      <Footer />
    </main>
  );
}
