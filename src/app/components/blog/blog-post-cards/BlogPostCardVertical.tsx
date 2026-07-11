import Link from "next/link";
import Image from "next/image";
import { BlogPostCardProps } from "./BlogPostCardProps";
import { formatDate, estimateReadTime } from "@/lib/utils";

export default function BlogPostCardVertical({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block w-full h-full">
      <div
        className={`flex flex-col h-full space-y-4 p-4 rounded-xl transition-colors duration-300 ${
          post.featured
            ? "bg-stone-100/80 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 hover:bg-stone-200/80 dark:hover:bg-stone-700/60"
            : "hover:bg-stone-100 dark:hover:bg-stone-800/50 border border-transparent"
        }`}
      >
        {/* Gradient image */}
        <div className="relative aspect-square rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={post.previewImageUrl || post.imageUrl}
            alt={post.title}
            fill
            className="object-cover aspect-square transition-transform duration-300 group-hover:scale-115"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2 line-clamp-3 flex items-start">
            <span className="flex-1">{post.title}</span>
            {post.featured && (
              <span className="ml-2 flex-shrink-0 mt-1" title="Featured Post">
                <svg
                  width="16"
                  height="16"
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

          <div className="flex flex-row text-xs text-stone-600 dark:text-stone-400 space-x-4 mt-auto">
            <span>{formatDate(post.timestamp)}</span>
            <span>{estimateReadTime(post.content)} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
