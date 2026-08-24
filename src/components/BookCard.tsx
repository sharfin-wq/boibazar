"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PriceTag } from "@/components/PriceTag"
import { RatingStars } from "@/components/RatingStars"
import { StockBadge } from "@/components/StockBadge"
import { cn } from "@/lib/utils"

export interface BookCardProps {
  /** Book ID or slug */
  id?: string | number
  /** Book title */
  title: string
  /** Author name */
  author: string
  /** Selling price */
  price: number
  /** Original price before discount */
  originalPrice?: number
  /** Discount percentage (calculated if omitted) */
  discountPercent?: number
  /** Book cover image URL */
  coverImage: string
  /** Rating score (0-5) */
  rating?: number
  /** Total reviews count */
  reviewsCount?: number
  /** Stock count (optional) */
  stockCount?: number
  /** Category or Genre (optional) */
  category?: string
  /** Custom badge text (e.g. "Bestseller", "New", "Editor's Choice") */
  badgeText?: string
  /** Link href to book details page */
  href?: string
  /** Currency symbol (default: '৳') */
  currency?: string
  /** Card size variant */
  size?: "sm" | "default" | "lg"
  /** Callback when Add to Cart button is clicked */
  onAddToCart?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Callback when Wishlist button is clicked */
  onAddToWishlist?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Whether the book is saved in the user's wishlist */
  isWishlisted?: boolean
  /** Additional CSS class names */
  className?: string
}

export function BookCard({
  title,
  author,
  price,
  originalPrice,
  discountPercent,
  coverImage,
  rating,
  reviewsCount,
  stockCount,
  category,
  badgeText,
  href,
  currency = "৳",
  size = "default",
  onAddToCart,
  onAddToWishlist,
  isWishlisted = false,
  className,
}: BookCardProps) {
  const [imgSrc, setImgSrc] = React.useState(coverImage)

  // Calculate discount percentage if not provided directly
  const discount = React.useMemo(() => {
    if (typeof discountPercent === "number" && discountPercent > 0) {
      return Math.round(discountPercent)
    }
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100)
    }
    return 0
  }, [price, originalPrice, discountPercent])

  const CardWrapper = href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={href} className="block group focus:outline-none">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="group">{children}</div>
      )

  return (
    <CardWrapper>
      <Card
        className={cn(
          "relative flex flex-col h-full overflow-hidden bg-card border-border/80 rounded-2xl",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30",
          className
        )}
      >
        {/* Cover Image Container */}
        <div className="relative w-full aspect-[3/4] bg-muted/40 overflow-hidden flex items-center justify-center p-3 sm:p-4">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

          {/* Book Image with shadow and hover zoom */}
          <div className="relative w-full h-full max-w-[85%] max-h-[92%] rounded-md overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
            <Image
              src={imgSrc || "/placeholder-book.jpg"}
              alt={`Cover of ${title} by ${author}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center"
              unoptimized
              onError={() => {
                // Fallback to a styled svg data url if image fails
                setImgSrc(
                  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420" fill="%238B1E2D"><rect width="300" height="420" fill="%238B1E2D"/><text x="50%" y="45%" fill="white" font-size="20" font-family="sans-serif" font-weight="bold" text-anchor="middle">BoiBazar</text><text x="50%" y="55%" fill="%23F3E8E2" font-size="14" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(title.slice(0, 20))}</text></svg>`
                )
              }}
            />
          </div>

          {/* Top Left Badges: Custom badge or Discount badge */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
            {badgeText && (
              <Badge className="bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-0.5 shadow-sm">
                {badgeText}
              </Badge>
            )}
            {discount > 0 && !badgeText && (
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 shadow-sm">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Quick Action Overlay (Wishlist) */}
          {onAddToWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToWishlist(e)
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "absolute top-2.5 right-2.5 z-20 size-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center transition-all duration-200 shadow-sm opacity-90 group-hover:opacity-100",
                isWishlisted
                  ? "text-rose-500 hover:text-rose-600 bg-rose-50/90 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900"
                  : "text-muted-foreground hover:text-primary hover:bg-card"
              )}
            >
              <Heart className={cn("size-4 transition-transform active:scale-125", isWishlisted && "fill-current")} />
            </button>
          )}

          {/* Stock Status Tag at bottom of cover if stock is provided */}
          {stockCount !== undefined && (
            <div className="absolute bottom-2 left-2 z-20">
              <StockBadge stockCount={stockCount} size="sm" lowStockThreshold={5} />
            </div>
          )}
        </div>

        {/* Book Details Content */}
        <CardContent className="flex flex-col flex-1 p-3.5 sm:p-4 gap-1.5 justify-between">
          <div className="space-y-1">
            {/* Category tag */}
            {category && (
              <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground/80 line-clamp-1">
                {category}
              </span>
            )}

            {/* Book Title */}
            <h3
              title={title}
              className="font-medium text-sm sm:text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200"
            >
              {title}
            </h3>

            {/* Author */}
            <p
              title={author}
              className="text-xs text-muted-foreground line-clamp-1 font-normal"
            >
              {author}
            </p>
          </div>

          <div className="pt-1.5 space-y-2 mt-auto">
            {/* Rating Stars */}
            {rating !== undefined && (
              <RatingStars
                rating={rating}
                reviewsCount={reviewsCount}
                showScore={true}
                size="sm"
              />
            )}

            {/* Price and Cart Action */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <PriceTag
                price={price}
                originalPrice={originalPrice}
                discountPercent={discountPercent}
                currency={currency}
                size={size === "sm" ? "sm" : "default"}
              />

              {onAddToCart && (
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAddToCart(e)
                  }}
                  className="rounded-full size-8 shrink-0 border-border/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  aria-label={`Add ${title} to cart`}
                >
                  <ShoppingCart className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
}
