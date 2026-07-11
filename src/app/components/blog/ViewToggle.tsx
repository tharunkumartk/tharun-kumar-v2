"use client";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export default function ViewToggle({
  viewMode,
  onViewChange,
}: ViewToggleProps) {
  const handleViewChange = (view: "grid" | "list") => {
    onViewChange(view);
  };

  return (
    <div className="flex items-center space-x-1 bg-stone-200 dark:bg-stone-700 rounded-lg p-1">
      <button
        onClick={() => handleViewChange("list")}
        className={`p-2 rounded-md transition-colors duration-200 ${
          viewMode === "list"
            ? "bg-white dark:bg-stone-600 text-stone-900 dark:text-white shadow-sm"
            : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
        }`}
        aria-label="List view"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>

      <button
        onClick={() => handleViewChange("grid")}
        className={`p-2 rounded-md transition-colors duration-200 ${
          viewMode === "grid"
            ? "bg-white dark:bg-stone-600 text-stone-900 dark:text-white shadow-sm"
            : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
        }`}
        aria-label="Grid view"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>
    </div>
  );
}
