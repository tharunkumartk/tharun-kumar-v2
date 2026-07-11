"use client";

import { useEffect, useRef, useState } from "react";
import { SortOrder } from "./blogHooks";

const OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "interesting", label: "Most interesting first" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

interface SortDropdownProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Sort order"
        className="flex cursor-pointer items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors focus:outline-none"
      >
        {selected.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-fade-fast absolute right-0 z-10 mt-2 min-w-[11rem] overflow-hidden rounded-md border border-faint bg-background py-1 shadow-lg"
        >
          {OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap px-3 py-1.5 text-left text-[13px] transition-colors ${
                    isSelected
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {option.label}
                  {isSelected && (
                    <span className="text-[10px] text-muted">✓</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
