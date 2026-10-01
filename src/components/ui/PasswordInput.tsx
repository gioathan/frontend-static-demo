"use client";

import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input ref={ref} type={visible ? "text" : "password"} className={cn("pr-12", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted hover:text-ink"
      >
        {visible ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
            <path d="M3 3 21 21" />
            <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
            <path d="M9.9 5.3A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a16.2 16.2 0 0 1-4.9 6.2" />
            <path d="M6.8 6.8A16.4 16.4 0 0 0 2 12s3.5 7 10 7a10.5 10.5 0 0 0 5.2-1.4" />
          </svg>
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
