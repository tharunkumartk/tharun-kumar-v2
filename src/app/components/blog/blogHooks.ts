import { useState, useMemo, useCallback } from "react";
import { BlogPost } from "@/lib/types";

export type SortOrder = "newest" | "oldest";

// Custom hook for blog filtering and sorting
export function useBlogFilters(posts: BlogPost[]) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    const filtered =
      selectedTags.length === 0
        ? posts
        : posts.filter((post) =>
            selectedTags.some((tag) => post.tags?.includes(tag))
          );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "newest") {
        return a.timestamp < b.timestamp ? 1 : -1;
      }
      return a.timestamp > b.timestamp ? 1 : -1;
    });
  }, [posts, selectedTags, sortOrder]);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  }, []);

  return {
    selectedTags,
    sortOrder,
    setSortOrder,
    toggleSortOrder,
    allTags,
    filteredAndSortedPosts,
    handleTagToggle,
    handleClearFilters,
  };
}
