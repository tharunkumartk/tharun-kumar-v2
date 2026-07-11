import Link from "next/link";

const Hero = () => {
  const phrases = ["Senior at Princeton University"];
  const blurbs = [
    "I'm a research engineer interested in training large models to reason about the world.",
  ];
  return (
    <div className="flex flex-col justify-start items-start">
      <h1
        className="font-bold text-stone-900 dark:text-stone-100 mb-2 opacity-0 animate-fadeIn"
        style={{
          fontSize: "45px",
          animationDelay: "0ms",
          animationFillMode: "forwards",
        }}
      >
        Tharun Kumar
      </h1>
      <div
        className="font-regular transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
        style={{
          fontSize: "22px",
          animationDelay: "100ms",
          animationFillMode: "forwards",
        }}
      >
        <span className="relative">
          <span className="">{phrases[0]}</span>
        </span>
      </div>
      <div
        className="mt-4 text-stone-600 dark:text-stone-400 transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
        style={{
          fontSize: "18px",
          animationDelay: "200ms",
          animationFillMode: "forwards",
        }}
      >
        <span className="relative">
          <span className="">{blurbs[0]}</span>
        </span>
      </div>
      <Link
        href="/blog"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-stone-900 dark:bg-stone-100 px-4 py-2 text-sm font-medium text-white dark:text-stone-900 shadow transition-colors hover:bg-stone-800 dark:hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 dark:focus-visible:ring-stone-300 disabled:pointer-events-none disabled:opacity-50 opacity-0 animate-fadeIn"
        style={{
          animationDelay: "300ms",
          animationFillMode: "forwards",
        }}
      >
        Check out my blog!
      </Link>
    </div>
  );
};

export default Hero;
