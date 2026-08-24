import Link from "next/link";
import prisma from "@/lib/prisma";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryQuickLinks } from "@/components/home/CategoryQuickLinks";
import { BookRail } from "@/components/home/BookRail";
import { AuthorStrip } from "@/components/home/AuthorStrip";
import { InteractiveBookCard } from "@/components/home/InteractiveBookCard";
import { HomeNewsletterBand } from "@/components/home/HomeNewsletterBand";
import {
  Flame,
  BookOpen,
  Sparkles,
  Rocket,
  Scroll,
  Clock,
  ArrowRight,
} from "lucide-react";

export default async function HomePage() {
  // Parallel database fetch for all homepage sections
  const [
    categories,
    trendingBooks,
    fictionBooks,
    selfHelpBooks,
    sciFiBooks,
    biographyBooks,
    newReleases,
    topAuthors,
  ] = await Promise.all([
    // 1. All 8 categories with book counts
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { bookCategories: true },
        },
      },
    }),

    // 2. Trending Now books (featured or high sales)
    prisma.book.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        author: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: {
        soldCount: "desc",
      },
      take: 10,
    }),

    // 3. Category Rail 1: Best of Fiction
    prisma.book.findMany({
      where: {
        categories: {
          some: {
            category: { slug: "fiction" },
          },
        },
      },
      include: {
        author: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { soldCount: "desc" },
      take: 8,
    }),

    // 4. Category Rail 2: Self-Help & Motivational
    prisma.book.findMany({
      where: {
        categories: {
          some: {
            category: { slug: "self-help-motivational" },
          },
        },
      },
      include: {
        author: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { soldCount: "desc" },
      take: 8,
    }),

    // 5. Category Rail 3: Science Fiction & Fantasy
    prisma.book.findMany({
      where: {
        categories: {
          some: {
            category: { slug: "sci-fi-fantasy" },
          },
        },
      },
      include: {
        author: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { soldCount: "desc" },
      take: 8,
    }),

    // 6. Category Rail 4: Biography & Memoir
    prisma.book.findMany({
      where: {
        categories: {
          some: {
            category: { slug: "biography-memoir" },
          },
        },
      },
      include: {
        author: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { soldCount: "desc" },
      take: 8,
    }),

    // 7. New Releases (ordered by createdAt)
    prisma.book.findMany({
      include: {
        author: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),

    // 8. Top Authors
    prisma.author.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        books: {
          _count: "desc",
        },
      },
      take: 10,
    }),
  ]);

  const mappedCategories = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    bookCount: c._count.bookCategories,
  }));

  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* 1. Hero banner carousel */}
      <HeroCarousel />

      {/* 2. "Shop by Category" quick-links row */}
      <CategoryQuickLinks categories={mappedCategories} />

      {/* 3. "Trending Now" rail */}
      <BookRail
        title="Trending Now"
        subtitle="Reader favorites and bestselling titles this week"
        icon={<Flame className="h-4 w-4 text-rose-500" />}
        viewAllHref="/search?sort=bestselling"
        viewAllText="View Trending"
        books={trendingBooks}
        badgeText="Trending"
      />

      {/* 4. Category-specific rails */}
      {/* 4a. Best of Fiction */}
      <BookRail
        title="Best of Fiction"
        subtitle="Acclaimed novels, short stories, and contemporary Bengali prose"
        icon={<BookOpen className="h-4 w-4 text-emerald-600" />}
        viewAllHref="/category/fiction"
        books={fictionBooks}
      />

      {/* 4b. Self-Help & Inspiration */}
      <BookRail
        title="Self-Help & Personal Growth"
        subtitle="Actionable wisdom, habits, mindset, and productivity guides"
        icon={<Sparkles className="h-4 w-4 text-amber-500" />}
        viewAllHref="/category/self-help-motivational"
        books={selfHelpBooks}
      />

      {/* 4c. Sci-Fi & Fantasy */}
      <BookRail
        title="Science Fiction & Fantasy"
        subtitle="Futuristic odysseys, alien worlds, and speculative thrillers"
        icon={<Rocket className="h-4 w-4 text-purple-600" />}
        viewAllHref="/category/sci-fi-fantasy"
        books={sciFiBooks}
      />

      {/* 4d. Biography & Memoir */}
      <BookRail
        title="Biography & Memoir"
        subtitle="Inspiring true stories, historical figures, and life journeys"
        icon={<Scroll className="h-4 w-4 text-teal-600" />}
        viewAllHref="/category/biography-memoir"
        books={biographyBooks}
      />

      {/* 5. "New Releases" grid */}
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                New Releases & Fresh Arrivals
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Discover the latest additions to the BoiBazar bookstore catalog
            </p>
          </div>

          <Link
            href="/search"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group"
          >
            <span>Browse All New</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {newReleases.map((book) => {
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
              <InteractiveBookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author.name}
                price={sellingPrice}
                originalPrice={originalPrice}
                coverImage={book.coverImageUrl}
                rating={avgRating}
                reviewsCount={book.reviews?.length}
                stockCount={book.stock}
                badgeText="New"
                href={`/book/${book.slug}`}
              />
            );
          })}
        </div>
      </section>

      {/* 6. "Top Authors" strip */}
      <AuthorStrip authors={topAuthors} />

      {/* 7. Newsletter signup band */}
      <HomeNewsletterBand />
    </div>
  );
}
