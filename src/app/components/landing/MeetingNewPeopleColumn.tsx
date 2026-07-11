"use client";

import { useRef, useState } from "react";

const MeetingNewPeopleColumn = () => {
  const [copied, setCopied] = useState(false);
  const resetCopyTimeoutRef = useRef<number | null>(null);
  const emailAddress = "tharuntk@princeton.edu";

  const copyEmailToClipboard = async () => {
    // Clear any existing timers so repeated clicks keep state visible
    if (resetCopyTimeoutRef.current) {
      clearTimeout(resetCopyTimeoutRef.current);
      resetCopyTimeoutRef.current = null;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = emailAddress;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      resetCopyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        resetCopyTimeoutRef.current = null;
      }, 2000);
    } catch {
      // In case copying fails, still briefly indicate an attempt
      setCopied(true);
      resetCopyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        resetCopyTimeoutRef.current = null;
      }, 2000);
    }
  };

  return (
    <div
      className="flex flex-col justify-start items-center pt-20 pb-20"
      id="meeting-new-people"
    >
      {/* Removed toast in favor of inline button state */}
      <div className="">
        <p
          className="font-light text-stone-600 dark:text-stone-400 opacity-0 animate-fadeIn"
          style={{
            fontSize: "18px",
            animationDelay: "100ms",
            animationFillMode: "forwards",
          }}
        >
          <span className="font-medium text-stone-900 dark:text-white">
            I love meeting new people.
          </span>{" "}
          {/* <br />
          <br /> */}
          Feel free to reach out if you have questions or just want to chat :)
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-md bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 shadow-inner px-4 py-2 text-sm font-medium">
          <span className="select-all">tharuntk (at) princeton (dot) edu</span>
          <button
            type="button"
            onClick={copyEmailToClipboard}
            aria-label={copied ? "Email copied" : "Copy email address"}
            className="inline-flex items-center justify-center rounded-md bg-stone-200 text-stone-900 dark:bg-stone-700 dark:text-stone-100 border border-stone-300 dark:border-stone-600 px-2 py-1 text-xs font-semibold transition-colors hover:bg-stone-300 dark:hover:bg-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500 active:translate-y-px"
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingNewPeopleColumn;
