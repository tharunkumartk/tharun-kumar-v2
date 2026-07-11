import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Children, isValidElement } from "react";
import fs from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { transformImageUrl } from "@/lib/utils";

const linkClass =
  "text-accent underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors";

// If an image has a sibling `<name>-dark.<ext>` file in /public, we serve that
// variant under `prefers-color-scheme: dark`. The /public file is the
// build-time existence gate; the returned path is CDN-transformed at the call
// site so it loads from the same CDN as the light image. Returns the dark
// image's relative path or null when no dark version exists. Runs at render
// time in the RSC layer.
function darkVariantPath(src: string): string | null {
  if (!src.startsWith("/")) return null;
  const dot = src.lastIndexOf(".");
  if (dot === -1) return null;
  const darkRel = `${src.slice(0, dot)}-dark${src.slice(dot)}`;
  try {
    return fs.existsSync(path.join(process.cwd(), "public", darkRel))
      ? darkRel
      : null;
  } catch {
    return null;
  }
}

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Headings — serif, normal weight
          h1: ({ children }) => (
            <h1 className="font-serif text-xl font-normal text-foreground mt-10 mb-3 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-xl font-normal text-foreground mt-10 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-lg font-normal text-foreground mt-8 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-serif text-base font-normal text-foreground mt-8 mb-2">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="font-serif text-[15px] font-normal text-foreground mt-8 mb-2">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="font-serif text-[14px] font-normal text-foreground mt-8 mb-2">
              {children}
            </h6>
          ),

          // Paragraphs
          // Always use a div wrapper to avoid invalid nesting when custom renderers
          // return block elements (e.g., video, image wrappers) inside paragraphs.
          p: ({ children }) => (
            <div className="text-[15px] leading-[1.6] text-foreground mb-5">
              {children}
            </div>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-5 space-y-1.5 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-5 space-y-1.5 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[15px] leading-[1.6]">{children}</li>
          ),

          // Links (with video-link rendering)
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
                    className="w-full rounded-sm my-8"
                  >
                    <source src={url} type={getMimeType(lowerUrl)} />
                    Your browser does not support the video tag.{" "}
                    <a
                      href={url}
                      className={linkClass}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download video
                    </a>
                  </video>
                  {caption && (
                    <span className="block text-center text-muted text-[13px] -mt-6 mb-5 italic">
                      {caption}
                    </span>
                  )}
                </>
              );
            }

            return (
              <a
                href={href}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },

          // Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,

          // Code
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <pre className="bg-surface border border-faint rounded-sm p-4 overflow-x-auto mb-5">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className="bg-surface px-1.5 py-0.5 rounded text-[13px] font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Blockquotes — quiet, no bg
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-faint pl-4 my-6 italic text-muted">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => <hr className="border-faint my-8" />,

          // Images — served through next/image for responsive WebP + lazy-loading.
          // When a `-dark` sibling exists, render both and toggle with CSS so the
          // dark variant shows under `prefers-color-scheme: dark`.
          img: ({ src, alt }) => {
            const altText = alt || "Markdown image";
            const rawSrc = (src as string) || "/images/blog/blog-1.jpeg";
            const transformedSrc = transformImageUrl(rawSrc);
            const darkRel = darkVariantPath(rawSrc);
            const darkSrc = darkRel ? transformImageUrl(darkRel) : null;
            const imgProps = {
              alt: altText,
              width: 1600,
              height: 900,
              sizes: "(max-width: 768px) 100vw, 672px",
            } as const;
            return (
              <span className="block my-8">
                {darkSrc ? (
                  <>
                    <Image
                      {...imgProps}
                      src={transformedSrc}
                      className="rounded-sm w-full h-auto block dark:hidden"
                    />
                    <Image
                      {...imgProps}
                      src={darkSrc}
                      className="rounded-sm w-full h-auto hidden dark:block"
                    />
                  </>
                ) : (
                  <Image
                    {...imgProps}
                    src={transformedSrc}
                    className="rounded-sm w-full h-auto"
                  />
                )}
                {alt && (
                  <span className="block text-center text-muted text-[13px] mt-2 italic">
                    {alt}
                  </span>
                )}
              </span>
            );
          },

          // Tables — minimal, header bottom border only
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="py-2 pr-4 text-left font-semibold text-foreground border-b border-faint">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-2 pr-4 text-[15px] leading-[1.6] text-foreground">
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
