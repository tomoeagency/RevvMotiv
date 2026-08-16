"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PrimaryCtaButton } from "@/app/components/PrimaryCtaButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <AlertTriangle className="w-10 h-10 text-red-400" />
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-ink uppercase tracking-tight mb-2">
          Something Went Wrong
        </h1>
        <p className="text-sm text-ink-muted max-w-sm mx-auto">
          We couldn&apos;t load this page. This has been logged — please try
          again.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <PrimaryCtaButton onClick={reset} className="px-12 py-4 text-sm">
          Try Again
        </PrimaryCtaButton>
        <Link
          href="/"
          className="text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
