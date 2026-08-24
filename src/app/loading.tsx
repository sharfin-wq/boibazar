import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookRailSkeleton } from "@/components/skeletons/BookRailSkeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Carousel Skeleton */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Skeleton className="w-full h-[280px] sm:h-[380px] lg:h-[440px] rounded-3xl" />
      </section>

      {/* Category Quick Links Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 sm:h-24 rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Book Rails Skeletons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <BookRailSkeleton itemCount={5} />
        <BookRailSkeleton itemCount={5} />
      </div>
    </div>
  );
}
