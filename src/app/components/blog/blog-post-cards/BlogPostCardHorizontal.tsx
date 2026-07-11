import Link from "next/link";
import Image from "next/image";
import { BlogPostCardProps } from "./BlogPostCardProps";
import { formatDate, estimateReadTime } from "@/lib/utils";

export default function BlogPostCardHorizontal({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block w-full h-full">
      <div
        className={`flex flex-col xl:flex-row h-full space-y-4 xl:space-y-0 xl:p-4 xl:rounded-lg xl:transition-colors xl:duration-300 ${
          post.featured
            ? "bg-stone-100/80 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 xl:hover:bg-stone-200/80 xl:dark:hover:bg-stone-700/60"
            : "xl:hover:bg-stone-100 xl:dark:hover:bg-stone-800/50 border border-transparent"
        }`}
      >
        {/* Content - appears first on small screens, second on large */}
        <div className="flex-1 flex flex-col justify-center order-1 xl:order-2 xl:ml-12">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3 text-[11px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                <span>{formatDate(post.timestamp)}</span>
                <span>•</span>
                <span>{estimateReadTime(post.content)} min read</span>
              </div>
              <h3 className="text-2xl font-medium text-stone-900 dark:text-white flex items-center leading-tight">
                {post.title}
                {post.featured && (
                  <span className="ml-3 flex-shrink-0" title="Featured Post">
                    <svg
                      width="18"
                      height="18"
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
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
              {post.summary}
            </p>
          </div>
        </div>

        {/* Image - appears below content on small screens, left on large */}
        <Image
          src={post.previewImageUrl || post.imageUrl}
          alt={post.title}
          width={200}
          height={150}
          className="rounded-xl flex-shrink-0 w-full xl:w-[200px] h-[150px] object-cover order-2 xl:order-1"
        />
      </div>
    </Link>
  );
}
