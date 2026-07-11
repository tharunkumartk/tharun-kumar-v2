"use client";

import { useRef, useState } from "react";

const CopyEmail = () => {
  const [copied, setCopied] = useState(false);
  const resetCopyTimeoutRef = useRef<number | null>(null);
  const emailAddress = "tharun.tiruppali@gmail.com";

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
    <span className="flex items-center gap-2 text-[14px] leading-[1.6] text-muted">
      <span className="select-all text-foreground">tharun.tiruppali (at) gmail (dot) com</span>
      <button
        type="button"
        onClick={copyEmailToClipboard}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className="cursor-pointer text-[13px] text-muted underline underline-offset-[3px] decoration-[1.5px] decoration-faint hover:decoration-current transition-colors"
      >
        {copied ? "copied" : "copy"}
      </button>
    </span>
  );
};

export default CopyEmail;
