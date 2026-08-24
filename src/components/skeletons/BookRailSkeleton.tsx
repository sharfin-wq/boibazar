import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCardSkeleton } from "./BookCardSkeleton";

interface BookRailSkeletonProps {
  itemCount?: number;
}

export function BookRailSkeleton({ itemCount = 5 }: BookRailSkeletonProps) {
  return (
    <section className="w-full py-6 space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-end justify-between px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-lg" />
            <Skeleton className="h-6 sm:h-7 w-40 sm:w-56 rounded-md" />
          </div>
          <Skeleton className="h-3.5 w-48 sm:w-72 rounded" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Grid / Rail of Book Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {Array.from({ length: itemCount }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
