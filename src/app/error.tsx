"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-500">
          <AlertCircle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We encountered an unexpected error while loading this page. This could be due to a temporary connection issue.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-muted-foreground/60">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto inline-flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
