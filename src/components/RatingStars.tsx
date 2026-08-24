import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RatingStarsProps {
  /** Numeric rating score (0 to 5) */
  rating: number
  /** Maximum number of stars (default: 5) */
  maxStars?: number
  /** Number of customer reviews (optional, e.g. 128) */
  reviewsCount?: number
  /** Whether to show the numerical rating next to the stars */
  showScore?: boolean
  /** Star size variant */
  size?: "sm" | "default" | "lg"
  /** Additional CSS class */
  className?: string
}

export function RatingStars({
  rating,
  maxStars = 5,
  reviewsCount,
  showScore = false,
  size = "default",
  className,
}: RatingStarsProps) {
  // Clamp rating between 0 and maxStars
  const clampedRating = Math.max(0, Math.min(rating, maxStars))

  const sizeConfig = {
    sm: {
      starSize: 14,
      textClass: "text-xs",
      gap: "gap-0.5",
    },
    default: {
      starSize: 16,
      textClass: "text-sm",
      gap: "gap-1",
    },
    lg: {
      starSize: 20,
      textClass: "text-base",
      gap: "gap-1.5",
    },
  }[size]

  return (
    <div
      data-slot="rating-stars"
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rating: ${clampedRating.toFixed(1)} out of ${maxStars} stars`}
    >
      <div className={cn("inline-flex items-center", sizeConfig.gap)}>
        {Array.from({ length: maxStars }, (_, index) => {
          const fillPercentage = Math.max(
            0,
            Math.min(100, (clampedRating - index) * 100)
          )

          return (
            <div
              key={index}
              className="relative inline-flex items-center justify-center shrink-0"
              style={{ width: sizeConfig.starSize, height: sizeConfig.starSize }}
            >
              {/* Background Empty Star */}
              <Star
                size={sizeConfig.starSize}
                className="text-muted-foreground/30 fill-muted-foreground/15 stroke-1"
                aria-hidden="true"
              />

              {/* Foreground Filled Star (Clipped based on exact fractional fill) */}
              {fillPercentage > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    size={sizeConfig.starSize}
                    className="text-amber-500 fill-amber-400 stroke-amber-500 stroke-1 shrink-0"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Numeric score */}
      {showScore && (
        <span
          className={cn(
            "font-semibold text-foreground tracking-tight ml-0.5",
            sizeConfig.textClass
          )}
        >
          {clampedRating.toFixed(1)}
        </span>
      )}

      {/* Review count */}
      {reviewsCount !== undefined && (
        <span
          className={cn(
            "text-muted-foreground font-normal",
            sizeConfig.textClass
          )}
        >
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
