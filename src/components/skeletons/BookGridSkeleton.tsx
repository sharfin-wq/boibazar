import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCardSkeleton } from "./BookCardSkeleton";

interface BookGridSkeletonProps {
  count?: number;
}

export function BookGridSkeleton({ count = 12 }: BookGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
      {/* Sidebar Filter Skeleton (Desktop) */}
      <div className="hidden lg:block lg:col-span-1 space-y-6 p-5 rounded-3xl bg-card border border-border/80">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-28 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-3/5 rounded" />
          </div>
        </div>
        <div className="space-y-4 pt-2 border-t border-border/60">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border/80">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-8 w-36 rounded-xl" />
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
