"use client";

import { useEffect, useRef, useState } from "react";
import { SortOrder } from "./blogHooks";

const OPTIONS: { value: SortOrder; label: string }[] = [
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
        className="flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors focus:outline-none"
      >
        {selected.label}
        <span
          className={`text-[9px] leading-none transition-transform duration-75 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-fade-fast absolute left-0 z-10 mt-2 min-w-[9rem] overflow-hidden rounded-md border border-faint bg-background py-1 shadow-lg"
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
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] transition-colors ${
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
