"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, BookOpen, Flame, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  tag: string;
  tagIcon: React.ReactNode;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgGradient: string;
  imageUrl: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: "Amar Ekushey Collection 2026",
    tagIcon: <Sparkles className="h-3.5 w-3.5 text-amber-400" />,
    headline: "Discover the Heart of Bengali Literature",
    subheadline:
      "Immerse yourself in celebrated classics by Humayun Ahmed, contemporary fiction, and timeless poetry with doorstep delivery across Bangladesh.",
    ctaText: "Explore Fiction",
    ctaLink: "/search?category=fiction",
    secondaryCtaText: "Browse All Books",
    secondaryCtaLink: "/search",
    bgGradient: "from-rose-950/90 via-zinc-950/80 to-black/60",
    imageUrl: "https://picsum.photos/seed/boibazar-banner-1/1600/600",
  },
  {
    id: 2,
    tag: "Exclusive Publisher Discounts",
    tagIcon: <Tag className="h-3.5 w-3.5 text-emerald-400" />,
    headline: "Grand Literary Sale — Up to 35% Off",
    subheadline:
      "Save on hundreds of bestselling novels, motivational guides, and academic textbooks from certified publishers with fast cash on delivery.",
    ctaText: "Shop Best Sellers",
    ctaLink: "/search?category=self-help-motivational",
    secondaryCtaText: "View Offers",
    secondaryCtaLink: "/search",
    bgGradient: "from-emerald-950/90 via-zinc-950/80 to-black/60",
    imageUrl: "https://picsum.photos/seed/boibazar-banner-2/1600/600",
  },
  {
    id: 3,
    tag: "Mind, Philosophy & Spirit",
    tagIcon: <Flame className="h-3.5 w-3.5 text-rose-400" />,
    headline: "Enrich Your Soul & Personal Wisdom",
    subheadline:
      "Expand your worldview with thoughtfully curated self-help, religious, and spiritual literature designed for deep reflection and personal growth.",
    ctaText: "Explore Spiritual Books",
    ctaLink: "/search?category=religious",
    secondaryCtaText: "Self-Help Catalog",
    secondaryCtaLink: "/search?category=self-help-motivational",
    bgGradient: "from-amber-950/90 via-zinc-950/80 to-black/60",
    imageUrl: "https://picsum.photos/seed/boibazar-banner-3/1600/600",
  },
  {
    id: 4,
    tag: "Sci-Fi & Academic Universes",
    tagIcon: <BookOpen className="h-3.5 w-3.5 text-cyan-400" />,
    headline: "Unravel Future Worlds & Academic Horizons",
    subheadline:
      "From speculative Bengali science fiction to comprehensive university textbooks, find the exact knowledge you need to fuel your curiosity.",
    ctaText: "Explore Sci-Fi & Fantasy",
    ctaLink: "/search?category=sci-fi-fantasy",
    secondaryCtaText: "Academic Collection",
    secondaryCtaLink: "/search?category=academic",
    bgGradient: "from-indigo-950/90 via-zinc-950/80 to-black/60",
    imageUrl: "https://picsum.photos/seed/boibazar-banner-4/1600/600",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const totalSlides = slides.length;

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-rotation timer
  React.useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      aria-label="Promotional Hero Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl"
    >
      {/* Slides Container */}
      <div className="relative h-[420px] sm:h-[460px] md:h-[500px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.headline}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                {/* Dynamic Gradient Overlays */}
                <div className={cn("absolute inset-0 bg-gradient-to-r", slide.bgGradient)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              </div>

              {/* Slide Content */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col justify-center max-w-3xl space-y-4 sm:space-y-6">
                {/* Tag Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-zinc-100 self-start shadow-xs">
                  {slide.tagIcon}
                  <span>{slide.tag}</span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                  {slide.headline}
                </h1>

                {/* Subheadline */}
                <p className="text-sm sm:text-base md:text-lg text-zinc-200 line-clamp-3 max-w-xl leading-relaxed">
                  {slide.subheadline}
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href={slide.ctaLink}>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/25 gap-2 text-sm sm:text-base"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {slide.secondaryCtaText && slide.secondaryCtaLink && (
                    <Link href={slide.secondaryCtaLink}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm font-medium text-sm sm:text-base"
                      >
                        {slide.secondaryCtaText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Left/Right Arrow Navigation Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all active:scale-95 shadow-md"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all active:scale-95 shadow-md"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
        {slides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isActive ? "w-6 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
              )}
            />
          );
        })}
      </div>
    </section>
  );
}
