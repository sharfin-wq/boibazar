import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function BookDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-36 rounded" />
      </div>

      {/* Main Book Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Cover Image Stage */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full aspect-[3/4] max-w-sm rounded-3xl bg-muted/40 p-6 flex items-center justify-center border border-border">
            <Skeleton className="w-[85%] h-[90%] rounded-xl" />
          </div>
        </div>

        {/* Right: Book Info & CTAs */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-4/5 rounded-md" />
            <Skeleton className="h-5 w-1/2 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-5 w-16 rounded" />
            </div>
            <Skeleton className="h-4 w-28 rounded" />
          </div>

          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 flex-1 rounded-2xl" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
