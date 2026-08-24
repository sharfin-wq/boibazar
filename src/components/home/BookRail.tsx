"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { InteractiveBookCard } from "@/components/home/InteractiveBookCard";
import { Button } from "@/components/ui/button";

export interface BookRailItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  discountPrice?: number | null;
  coverImageUrl: string;
  stock?: number;
  author: {
    name: string;
  };
  reviews?: {
    rating: number;
  }[];
}

interface BookRailProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  viewAllHref?: string;
  viewAllText?: string;
  books: BookRailItem[];
  badgeText?: string;
}

export function BookRail({
  title,
  subtitle,
  icon,
  viewAllHref,
  viewAllText = "View All",
  books,
  badgeText,
}: BookRailProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  React.useEffect(() => {
    checkScrollability();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                {icon}
              </div>
            )}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group mr-1"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          {/* Desktop Left/Right Scroll Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="size-8 rounded-full border-border bg-card/80 backdrop-blur-sm"
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="size-8 rounded-full border-border bg-card/80 backdrop-blur-sm"
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Books Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {books.map((book) => {
          const avgRating =
            book.reviews && book.reviews.length > 0
              ? book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length
              : undefined;

          const hasDiscount =
            book.discountPrice !== null &&
            book.discountPrice !== undefined &&
            book.discountPrice < book.price;
          const sellingPrice =
            hasDiscount && book.discountPrice !== null && book.discountPrice !== undefined
              ? book.discountPrice
              : book.price;
          const originalPrice = hasDiscount ? book.price : undefined;

          return (
            <div
              key={book.id}
              className="w-[180px] sm:w-[210px] md:w-[230px] flex-shrink-0 snap-start"
            >
              <InteractiveBookCard
                id={book.id}
                title={book.title}
                author={book.author.name}
                price={sellingPrice}
                originalPrice={originalPrice}
                coverImage={book.coverImageUrl}
                rating={avgRating}
                reviewsCount={book.reviews?.length}
                stockCount={book.stock}
                badgeText={badgeText}
                href={`/book/${book.slug}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
