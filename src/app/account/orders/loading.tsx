import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <Skeleton className="h-8 w-44 rounded-md" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>

      {/* Order Cards Skeletons */}
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="rounded-3xl border border-border bg-card p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/60">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex gap-4 items-center">
              <Skeleton className="size-14 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
              <Skeleton className="h-5 w-16 rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
