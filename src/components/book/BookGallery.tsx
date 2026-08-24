"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { StockBadge } from "@/components/StockBadge";
import { Sparkles, ShieldCheck } from "lucide-react";

interface BookGalleryProps {
  title: string;
  author: string;
  coverImageUrl?: string | null;
  price: number;
  discountPrice?: number | null;
  stock?: number;
  isFeatured?: boolean;
}

export function BookGallery({
  title,
  author,
  coverImageUrl,
  price,
  discountPrice,
  stock,
  isFeatured,
}: BookGalleryProps) {
  const [imgSrc, setImgSrc] = React.useState(coverImageUrl || "/placeholder-book.jpg");

  const hasDiscount =
    discountPrice !== null &&
    discountPrice !== undefined &&
    discountPrice < price;

  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Stage */}
      <div className="group relative w-full aspect-[3/4] max-h-[540px] rounded-3xl bg-linear-to-b from-muted/60 via-muted/30 to-muted/80 border border-border/80 p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        {/* Subtle Ambient Backdrop Glow */}
        <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Book Cover with 3D Shadow & Zoom Effect */}
        <div className="relative w-full h-full max-w-[82%] max-h-[92%] rounded-lg overflow-hidden shadow-2xl transition-all duration-500 ease-out transform group-hover:scale-105 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]">
          <Image
            src={imgSrc || "/placeholder-book.jpg"}
            alt={`Cover of ${title} by ${author}`}
            fill
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 420px"
            className="object-cover object-center select-none"
            unoptimized
            onError={() => {
              setImgSrc(
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" fill="%238B1E2D"><rect width="400" height="600" fill="%238B1E2D"/><text x="50%" y="45%" fill="white" font-size="24" font-family="sans-serif" font-weight="bold" text-anchor="middle">BoiBazar</text><text x="50%" y="55%" fill="%23F3E8E2" font-size="16" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(
                  title.slice(0, 25)
                )}</text></svg>`
              );
            }}
          />

          {/* Book Spine Overlay Effect */}
          <div className="absolute inset-y-0 left-0 w-3 bg-linear-to-r from-black/30 via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Floating Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 shadow-md border-0">
              -{discountPercent}% OFF
            </Badge>
          )}
          {isFeatured && (
            <Badge className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 shadow-md flex items-center gap-1 border-0">
              <Sparkles className="size-3" />
              <span>Featured</span>
            </Badge>
          )}
        </div>

        {/* Stock Badge at Bottom Left */}
        {stock !== undefined && (
          <div className="absolute bottom-4 left-4 z-10">
            <StockBadge stockCount={stock} size="default" lowStockThreshold={5} />
          </div>
        )}
      </div>

      {/* Trust & Guarantee Pill Strip */}
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/70">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-foreground">100% Original Book</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/70">
          <Sparkles className="size-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">Fast Islandwide Delivery</span>
        </div>
      </div>
    </div>
  );
}
