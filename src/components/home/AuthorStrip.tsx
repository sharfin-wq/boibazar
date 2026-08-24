"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Feather, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AuthorStripItem {
  id: string;
  slug: string;
  name: string;
  bio?: string | null;
  photoUrl?: string | null;
  _count?: {
    books: number;
  };
}

interface AuthorStripProps {
  authors: AuthorStripItem[];
}

export function AuthorStrip({ authors }: AuthorStripProps) {
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
  }, [authors]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!authors || authors.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Feather className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Top Literary Authors
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore works by celebrated Bengali and international authors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/authors"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group mr-1"
          >
            <span>View All Authors</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Scroll Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="size-8 rounded-full border-border bg-card/80 backdrop-blur-sm"
              aria-label="Scroll authors left"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="size-8 rounded-full border-border bg-card/80 backdrop-blur-sm"
              aria-label="Scroll authors right"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Authors Strip */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {authors.map((author) => {
          return (
            <Link
              key={author.id}
              href={`/author/${author.slug}`}
              className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-2xs hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 w-[170px] sm:w-[190px] flex-shrink-0 snap-start"
            >
              {/* Author Portrait with gradient ring */}
              <div className="relative size-20 sm:size-24 rounded-full p-1 bg-gradient-to-tr from-primary/30 to-amber-500/30 mb-3 group-hover:scale-105 transition-transform duration-300">
                <div className="relative size-full rounded-full overflow-hidden bg-muted border-2 border-background">
                  {author.photoUrl ? (
                    <Image
                      src={author.photoUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                      {author.name[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Author Name */}
              <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {author.name}
              </h3>

              {/* Book Count Badge */}
              <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-1 px-2 py-0.5 rounded-full bg-muted/60">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>{author._count?.books || 0} Books</span>
              </div>

              {/* Bio snippet if available */}
              {author.bio && (
                <p className="text-[11px] text-muted-foreground/80 line-clamp-2 mt-2 leading-relaxed">
                  {author.bio}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
