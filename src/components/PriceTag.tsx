import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface PriceTagProps {
  /** The current / selling price */
  price: number
  /** The original before-discount price (optional) */
  originalPrice?: number
  /** Discount percentage override (optional, automatically calculated if originalPrice > price) */
  discountPercent?: number
  /** Currency symbol or prefix (default: '৳') */
  currency?: string
  /** Size variant */
  size?: "sm" | "default" | "lg"
  /** Additional CSS class names */
  className?: string
  /** Format numbers with comma separation */
  formatNumber?: boolean
}

export function PriceTag({
  price,
  originalPrice,
  discountPercent,
  currency = "৳",
  size = "default",
  className,
  formatNumber = true,
}: PriceTagProps) {
  const calculatedDiscount = React.useMemo(() => {
    if (typeof discountPercent === "number" && discountPercent > 0) {
      return Math.round(discountPercent)
    }
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100)
    }
    return 0
  }, [price, originalPrice, discountPercent])

  const formattedPrice = formatNumber ? price.toLocaleString() : price.toString()
  const formattedOriginalPrice =
    originalPrice !== undefined
      ? formatNumber
        ? originalPrice.toLocaleString()
        : originalPrice.toString()
      : null

  const sizeClasses = {
    sm: {
      container: "gap-1.5",
      price: "text-sm font-bold",
      original: "text-xs",
      badge: "text-[10px] px-1.5 py-0 h-4 font-semibold",
    },
    default: {
      container: "gap-2",
      price: "text-lg font-bold",
      original: "text-sm",
      badge: "text-xs px-2 py-0.5 h-5 font-semibold",
    },
    lg: {
      container: "gap-2.5",
      price: "text-2xl sm:text-3xl font-extrabold tracking-tight",
      original: "text-base sm:text-lg",
      badge: "text-xs sm:text-sm px-2.5 py-0.5 h-6 font-semibold",
    },
  }[size]

  return (
    <div
      data-slot="price-tag"
      className={cn("inline-flex items-baseline flex-wrap", sizeClasses.container, className)}
    >
      {/* Current prominent price in primary color */}
      <span className={cn("text-primary tracking-tight font-sans", sizeClasses.price)}>
        <span className="font-medium mr-0.5">{currency}</span>
        {formattedPrice}
      </span>

      {/* Original Struck-through Price */}
      {originalPrice && originalPrice > price && (
        <span
          className={cn(
            "text-muted-foreground line-through decoration-muted-foreground/60 decoration-1",
            sizeClasses.original
          )}
          aria-label={`Original price ${currency}${formattedOriginalPrice}`}
        >
          {currency}
          {formattedOriginalPrice}
        </span>
      )}

      {/* Discount Percentage Badge */}
      {calculatedDiscount > 0 && (
        <Badge
          variant="default"
          className={cn(
            "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 shrink-0 transition-colors",
            sizeClasses.badge
          )}
        >
          -{calculatedDiscount}%
        </Badge>
      )}
    </div>
  )
}
