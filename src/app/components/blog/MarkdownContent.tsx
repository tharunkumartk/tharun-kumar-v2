import ReactMarkdown from "react-markdown";
import { Children, isValidElement } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
// import Image from "next/image";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { transformImageUrl } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mt-12 mb-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-10 mb-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-8 mb-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-6 mb-3">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mt-6 mb-3">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold text-stone-900 dark:text-stone-100 mt-6 mb-3">
              {children}
            </h6>
          ),

          // Paragraphs
          // Always use a div wrapper to avoid invalid nesting when custom renderers
          // return block elements (e.g., video, image wrappers) inside paragraphs.
          p: ({ children }) => (
            <div className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              {children}
            </div>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-6 space-y-2 text-stone-700 dark:text-stone-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-6 space-y-2 text-stone-700 dark:text-stone-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-lg leading-relaxed">{children}</li>
          ),

          // Links
          a: ({ href, children }) => {
            const url = (href as string) || "";
            const lowerUrl = url.toLowerCase();
            const isVideo =
              lowerUrl.endsWith(".mp4") ||
              lowerUrl.endsWith(".mov") ||
              lowerUrl.endsWith(".webm") ||
              lowerUrl.endsWith(".m3u8");

            const getMimeType = (u: string): string => {
              if (u.endsWith(".mp4")) return "video/mp4";
              if (u.endsWith(".mov")) return "video/quicktime";
              if (u.endsWith(".webm")) return "video/webm";
              if (u.endsWith(".m3u8")) return "application/vnd.apple.mpegurl";
              return "video/*";
            };

            if (isVideo) {
              const extractText = (nodes: React.ReactNode): string => {
                return Children.toArray(nodes)
                  .map((node) => {
                    if (typeof node === "string") return node;
                    if (isValidElement(node)) {
                      const element = node as React.ReactElement<{
                        children?: React.ReactNode;
                      }>;
                      return extractText(element.props?.children);
                    }
                    return "";
                  })
                  .join("")
                  .trim();
              };

              const caption = extractText(children);

              return (
                <>
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full rounded-lg shadow-lg my-8"
                  >
                    <source src={url} type={getMimeType(lowerUrl)} />
                    Your browser does not support the video tag.{" "}
                    <a
                      href={url}
                      className="text-blue-600 dark:text-blue-400 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download video
                    </a>
                  </video>
                  {caption && (
                    <span className="block text-center text-stone-500 dark:text-stone-400 text-sm -mt-6 mb-6 italic">
                      {caption}
                    </span>
                  )}
                </>
              );
            }

            return (
              <a
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },

          // Emphasis
          strong: ({ children }) => (
            <strong className="font-bold text-stone-900 dark:text-stone-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-stone-800 dark:text-stone-200">
              {children}
            </em>
          ),

          // Code
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <pre className="bg-stone-100 dark:bg-stone-800 rounded-lg p-4 overflow-x-auto mb-6">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2 py-1 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-stone-300 dark:border-stone-600 pl-6 py-2 my-6 bg-stone-50 dark:bg-stone-800/50 rounded-r-lg">
              <div className="text-stone-700 dark:text-stone-300 italic">
                {children}
              </div>
            </blockquote>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="border-stone-300 dark:border-stone-600 my-8" />
          ),

          // Images
          img: ({ src, alt }) => {
            const altText = alt || "Markdown image";
            const transformedSrc = transformImageUrl(
              (src as string) || "/images/blog/blog-1.jpeg"
            );
            return (
              <div className="my-8">
                {/* Use a plain img to avoid any SSR/client mismatch from Next/Image runtime logic in MD */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={transformedSrc}
                  alt={altText}
                  className="rounded-lg shadow-lg w-full object-cover"
                />
                {alt && (
                  <div className="text-center text-stone-500 dark:text-stone-400 text-sm mt-2 italic">
                    {alt}
                  </div>
                )}
              </div>
            );
          },

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-stone-300 dark:border-stone-600">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-stone-100 dark:bg-stone-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white dark:bg-stone-900">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-stone-300 dark:border-stone-600">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-stone-900 dark:text-stone-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-stone-700 dark:text-stone-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
