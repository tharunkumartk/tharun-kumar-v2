"use client";

import Link from "next/link";
import { useCurrentPage } from "@/app/components/landing/ScrollDetector";

interface NavItem {
  label: string;
  href: string;
  isSelected?: boolean;
}

interface NavbarProps {
  currentPage?: string; // Keep for backwards compatibility, but use context when available
}

const Navbar = ({ currentPage: propCurrentPage }: NavbarProps) => {
  const contextCurrentPage = useCurrentPage();
  const currentPage = contextCurrentPage || propCurrentPage || "";

  const navItems: NavItem[] = [
    {
      label: "ABOUT",
      href: "/#about",
      isSelected: currentPage === "" || currentPage === "about",
    },
    {
      label: "EXPERIENCE",
      href: "#experience",
      isSelected: currentPage === "experience",
    },
    {
      label: "PROJECTS",
      href: "#projects",
      isSelected: currentPage === "projects",
    },
    // {
    //   label: "BLOG",
    //   href: "/blog",
    //   isSelected: currentPage === "blog",
    // },
    {
      label: "RESUME",
      href: "/resume.pdf",
      isSelected: currentPage === "resume",
    },
  ];

  return (
    <nav
      className="z-50 bg-transparent opacity-0 animate-fadeIn"
      style={{
        animationDelay: "400ms",
        animationFillMode: "forwards",
      }}
      aria-label="Main site navigation"
    >
      <div className="flex py-8">
        <div className="flex flex-col space-y-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative flex items-center justify-start"
            >
              {/* Line indicator */}
              <div className="relative mr-4 w-12">
                <div
                  className={`h-px bg-black dark:bg-white transition-all duration-300 ease-out origin-left ${
                    item.isSelected ? "w-12" : "w-6 group-hover:w-12"
                  }`}
                />
              </div>

              {/* Text */}
              <span
                className={`text-sm font-medium tracking-wide transition-all duration-300 ${
                  item.isSelected
                    ? "text-black dark:text-white opacity-100"
                    : "text-black dark:text-white opacity-60 group-hover:opacity-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
