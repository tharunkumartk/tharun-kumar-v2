import Link from "next/link";
import BackButton from "./components/blog/BackButton";
import FooterColumn from "./components/landing/FooterColumn";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between pt-16 px-4 max-w-4xl mx-auto w-full">
        <BackButton href="/" title="Home" />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Header */}
          <div>
            <h1
              className="font-regular text-stone-900 dark:text-stone-100 mb-2 opacity-0 animate-fadeIn"
              style={{
                fontSize: "65px",
                animationDelay: "0ms",
                animationFillMode: "forwards",
              }}
            >
              404
            </h1>
            <h2
              className="font-regular text-stone-700 dark:text-stone-300 mb-4 opacity-0 animate-fadeIn"
              style={{
                fontSize: "32px",
                animationDelay: "100ms",
                animationFillMode: "forwards",
              }}
            >
              Page Not Found
            </h2>
            <p
              className="mt-4 text-stone-600 dark:text-stone-400 transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn max-w-2xl mx-auto"
              style={{
                fontSize: "18px",
                animationDelay: "200ms",
                animationFillMode: "forwards",
              }}
            >
              It looks like you&apos;ve taken a wrong turn. This page
              doesn&apos;t exist.
            </p>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-stone-900 dark:bg-stone-100 px-4 py-2 text-sm font-medium text-white dark:text-stone-900 shadow transition-colors hover:bg-stone-800 dark:hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 dark:focus-visible:ring-stone-300 disabled:pointer-events-none disabled:opacity-50 opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "300ms",
                  animationFillMode: "forwards",
                }}
              >
                Go to Home
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-md bg-stone-900 dark:bg-stone-100 px-4 py-2 text-sm font-medium text-white dark:text-stone-900 shadow transition-colors hover:bg-stone-800 dark:hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 dark:focus-visible:ring-stone-300 disabled:pointer-events-none disabled:opacity-50 opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "400ms",
                  animationFillMode: "forwards",
                }}
              >
                Check out my blog!
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer at Bottom */}
      <div className="px-8">
        <div className="max-w-4xl mx-auto">
          <FooterColumn />
        </div>
      </div>
    </div>
  );
}
