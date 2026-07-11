"use client";

import { useState } from "react";
import BlogPostCardVertical from "./blog-post-cards/BlogPostCardVertical";
import BlogPostCardHorizontalLong from "./blog-post-cards/BlogPostCardHorizontalLong";
import BackButton from "./BackButton";
import FooterColumn from "../landing/FooterColumn";
import ViewToggle from "./ViewToggle";
import { BlogPost } from "@/lib/types";
import {
  useBlogFilters,
  useDropdownState,
  SORT_OPTIONS,
  ViewMode,
} from "./blogHooks";

interface BlogPageClientProps {
  posts: BlogPost[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Use custom hooks for filtering and dropdown state management
  const {
    selectedTags,
    sortOrder,
    setSortOrder,
    allTags,
    filteredAndSortedPosts,
    handleTagToggle,
    handleClearFilters,
  } = useBlogFilters(posts);

  const { openDropdown, toggleDropdown, closeDropdown } = useDropdownState();

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  const handleFilterToggle = () => {
    toggleDropdown("filter");
  };

  const handleSortToggle = () => {
    toggleDropdown("sort");
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Header with Back Button */}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16 py-16 space-y-16">
          <div className="max-w-6xl mx-auto w-full">
            <BackButton href="/" title="Home" />

            {/* Blog Header */}
            <div className="mb-12">
              <div className="text-center">
                <h1
                  className="font-regular text-stone-900 dark:text-stone-100 mb-2 opacity-0 animate-fadeIn"
                  style={{
                    fontSize: "65px",
                    animationDelay: "0ms",
                    animationFillMode: "forwards",
                  }}
                >
                  Blog
                </h1>
                <p
                  className="mt-4 text-stone-600 dark:text-stone-400 transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
                  style={{
                    fontSize: "18px",
                    animationDelay: "100ms",
                    animationFillMode: "forwards",
                  }}
                >
                  A collection of memories, projects, and dialogue
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Filter Dropdown */}
                  <div className="relative filter-dropdown">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterToggle();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors opacity-0 animate-fadeIn"
                      style={{
                        animationDelay: "200ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      Topic
                      <span className="ml-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-2 py-0.5 rounded-full">
                        {selectedTags.length}
                      </span>
                    </button>

                    {/* Filter Dropdown Menu */}
                    {openDropdown === "filter" && (
                      <div
                        className="absolute top-full left-0 mt-2 w-96 max-w-[80vw] bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg shadow-lg z-50 flex flex-col max-h-96 dropdown-enter"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-stone-900 dark:text-stone-300 mb-3">
                                Topic
                              </h3>
                              <div className="space-y-2">
                                {allTags.map((tag) => {
                                  const isSelected = selectedTags.includes(tag);
                                  return (
                                    <label
                                      key={tag}
                                      className="flex items-center gap-3 p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleTagToggle(tag)}
                                        className="w-4 h-4 text-blue-500 bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 rounded focus:ring-blue-500 focus:ring-2"
                                      />
                                      <span className="text-sm text-stone-900 dark:text-stone-300">
                                        {tag}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Fixed Clear All Button */}
                        <div className="border-t border-stone-300 dark:border-stone-700 p-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearFilters();
                              closeDropdown();
                            }}
                            className="text-sm text-stone-900 dark:text-stone-300 hover:text-stone-700 dark:hover:text-white transition-colors opacity-0 animate-fadeIn"
                            style={{
                              animationDelay: "200ms",
                              animationFillMode: "forwards",
                            }}
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative sort-dropdown">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSortToggle();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors opacity-0 animate-fadeIn"
                      style={{
                        animationDelay: "225ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        />
                      </svg>
                      Sort
                    </button>

                    {/* Sort Dropdown Menu */}
                    {openDropdown === "sort" && (
                      <div
                        className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg shadow-lg z-50 dropdown-enter"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-3">
                          <div className="space-y-1">
                            {SORT_OPTIONS.map((option) => (
                              <label
                                key={option.value}
                                className="flex items-center gap-3 p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="sort"
                                  value={option.value}
                                  checked={sortOrder === option.value}
                                  onChange={() => {
                                    setSortOrder(option.value);
                                    closeDropdown();
                                  }}
                                  className="w-4 h-4 text-blue-500 bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm text-stone-900 dark:text-stone-300">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Only show view toggle on desktop */}
                <div className="hidden md:block">
                  <ViewToggle
                    viewMode={viewMode}
                    onViewChange={handleViewChange}
                  />
                </div>
              </div>

              {/* Filter Status */}
              <div
                className="mt-4 opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "250ms",
                  animationFillMode: "forwards",
                }}
              >
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {filteredAndSortedPosts.length} of {posts.length} posts
                </p>
              </div>
            </div>

            {/* Blog Posts */}
            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-stone-600 dark:text-stone-400 text-lg">
                  {selectedTags.length > 0
                    ? "No posts found with the selected tags."
                    : "No posts available."}
                </p>
                {selectedTags.length > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* On mobile, always show list view. On desktop, respect viewMode */}
                <div className="md:hidden">
                  <div className="space-y-6 mb-16">
                    {filteredAndSortedPosts.map((post, index) => (
                      <div
                        key={post.slug + index}
                        className="opacity-0 animate-fadeIn"
                        style={{
                          animationDelay: `${300 + index * 100}ms`,
                          animationFillMode: "forwards",
                        }}
                      >
                        <BlogPostCardHorizontalLong post={post} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop view - respect viewMode setting */}
                <div className="hidden md:block">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                      {filteredAndSortedPosts.map((post, index) => (
                        <div
                          key={post.slug + index}
                          className="opacity-0 animate-fadeIn"
                          style={{
                            animationDelay: `${300 + index * 100}ms`,
                            animationFillMode: "forwards",
                          }}
                        >
                          <BlogPostCardVertical post={post} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6 mb-16">
                      {filteredAndSortedPosts.map((post, index) => (
                        <div
                          key={post.slug + index}
                          className="opacity-0 animate-fadeIn"
                          style={{
                            animationDelay: `${300 + index * 100}ms`,
                            animationFillMode: "forwards",
                          }}
                        >
                          <BlogPostCardHorizontalLong post={post} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8">
          <div className="max-w-6xl mx-auto">
            <FooterColumn />
          </div>
        </div>
      </div>
    </>
  );
}
