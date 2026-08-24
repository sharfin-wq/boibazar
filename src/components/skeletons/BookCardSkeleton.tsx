import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function BookCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "relative flex flex-col h-full overflow-hidden bg-card border-border/80 rounded-2xl p-0",
        className
      )}
    >
      {/* Cover image skeleton */}
      <div className="relative w-full aspect-[3/4] bg-muted/40 p-3 sm:p-4 flex items-center justify-center">
        <Skeleton className="w-[85%] h-[92%] rounded-md" />
      </div>

      {/* Book details skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="h-3 w-3/5 rounded" />
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-3 w-10 rounded" />
          </div>
          <Skeleton className="h-8 w-full rounded-xl" />
        </div>
      </div>
    </Card>
  );
}
