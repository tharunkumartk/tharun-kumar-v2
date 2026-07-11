import Link from "next/link";

interface BackButtonProps {
  href: string;
  title: string;
}

export default function BackButton({ href, title }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors duration-200"
    >
      <svg
        className="mr-2 w-4 h-4 transition-transform duration-200 ease-in-out group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to {title}
    </Link>
  );
}
