import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface StockBadgeProps {
  /** Available inventory count */
  stockCount?: number
  /** Boolean fallback if exact count is not available */
  inStock?: boolean
  /** Threshold below which to warn low stock (default: 0 = disabled) */
  lowStockThreshold?: number
  /** Size variant */
  size?: "sm" | "default"
  /** Custom label override */
  label?: string
  /** Additional CSS class names */
  className?: string
}

export function StockBadge({
  stockCount,
  inStock,
  lowStockThreshold = 0,
  size = "default",
  label,
  className,
}: StockBadgeProps) {
  // Determine in-stock state
  const isAvailable =
    stockCount !== undefined ? stockCount > 0 : inStock !== undefined ? inStock : true

  const isLowStock =
    stockCount !== undefined &&
    stockCount > 0 &&
    lowStockThreshold > 0 &&
    stockCount <= lowStockThreshold

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 h-5 gap-1.5",
    default: "text-xs px-2.5 py-0.5 h-6 gap-1.5",
  }[size]

  if (!isAvailable) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-destructive/10 text-destructive border-destructive/20 font-medium",
          sizeClasses,
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />
        {label || "Out of Stock"}
      </Badge>
    )
  }

  if (isLowStock) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium",
          sizeClasses,
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
        {label || `Only ${stockCount} left`}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-success/10 text-success border-success/20 font-medium",
        sizeClasses,
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
      {label || "In Stock"}
    </Badge>
  )
}
