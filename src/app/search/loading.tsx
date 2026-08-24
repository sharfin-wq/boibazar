import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookGridSkeleton } from "@/components/skeletons/BookGridSkeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-md" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>

      {/* Main Grid Skeleton */}
      <BookGridSkeleton count={12} />
    </div>
  );
}
