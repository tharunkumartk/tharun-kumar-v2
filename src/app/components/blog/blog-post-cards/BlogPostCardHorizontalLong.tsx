import Link from "next/link";
import Image from "next/image";
import { BlogPostCardProps } from "./BlogPostCardProps";
import { formatDate, estimateReadTime } from "@/lib/utils";

export default function BlogPostCardHorizontalLong({
  post,
}: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block w-full">
      <div
        className={`flex flex-col md:flex-row w-full p-6 rounded-xl transition-colors duration-300 ${
          post.featured
            ? "bg-stone-100/80 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 hover:bg-stone-200/80 dark:hover:bg-stone-700/60"
            : "hover:bg-stone-100 dark:hover:bg-stone-800/50 border border-transparent"
        }`}
      >
        {/* Image */}
        <div className="relative w-full md:w-48 h-32 md:h-36 rounded-lg overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <Image
            src={post.previewImageUrl || post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {/* Title and Summary */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-medium text-stone-900 dark:text-white mb-3 line-clamp-2 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors duration-300 flex items-center">
              {post.title}
              {post.featured && (
                <span className="ml-3 flex-shrink-0" title="Featured Post">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#FFD700"
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
              )}
            </h3>

            <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">
              {post.summary}
            </p>
          </div>

          {/* Meta information */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center text-sm text-stone-600 dark:text-stone-400 space-x-4">
              <span>{formatDate(post.timestamp)}</span>
              <span className="hidden sm:inline">•</span>
              <span>{estimateReadTime(post.content)} min read</span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-md">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
