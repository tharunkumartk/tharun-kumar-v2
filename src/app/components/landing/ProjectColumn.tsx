import { getBlogPosts } from "@/lib/blog";
import ProjectCardHorizontal from "@/app/components/landing/ProjectCardHorizontal";
import Link from "next/link";
import { projectsDirectory } from "@/lib/types";

export default function ProjectColumn() {
  const projects = getBlogPosts(projectsDirectory);

  return (
    <div
      id="projects"
      className="flex flex-col space-y-8 pt-10 lg:pt-20 pb-10 lg:pb-20"
    >
      <h2 className="text-md font-medium text-stone-900 dark:text-stone-100 block xl:hidden mb-4">
        PROJECTS
      </h2>
      {projects.slice(0, 3).map((project, index) => (
        <div
          key={project.slug}
          className="opacity-0 animate-fadeIn"
          style={{
            animationDelay: `${index * 100 + 200}ms`,
            animationFillMode: "forwards",
          }}
        >
          <ProjectCardHorizontal project={project} />
        </div>
      ))}

      <div
        className="flex mt-8 opacity-0 animate-fadeIn justify-start"
        style={{
          animationDelay: `${2 * 200}ms`,
          animationFillMode: "forwards",
        }}
      >
        <Link
          href="/blog"
          className="group inline-flex items-center justify-center px-6 py-3 text-md font-medium text-stone-900 dark:text-stone-100 bg-transparent  dark:border-stone-600 rounded-md  dark:hover:border-stone-500 transition-all duration-200 ease-in-out"
        >
          View All
          <svg
            className="ml-2 w-4 h-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
