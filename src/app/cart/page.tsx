import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CartView } from "@/components/cart/CartView";
import { BookRail } from "@/components/home/BookRail";
import { ShoppingBag, ArrowLeft, Sparkles, Home, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shopping Cart | BoiBazar",
  description: "Review items in your cart, adjust quantities, and proceed to checkout on BoiBazar.",
};

export default async function CartPage() {
  // Query recommendations for "You might also like" rail
  let recommendedBooks = await prisma.book.findMany({
    where: {
      isFeatured: true,
    },
    include: {
      author: {
        select: { name: true },
      },
      reviews: {
        select: { rating: true },
      },
    },
    orderBy: { soldCount: "desc" },
    take: 10,
  });

  // Fallback if few featured books
  if (recommendedBooks.length < 5) {
    const additionalBooks = await prisma.book.findMany({
      where: {
        id: { notIn: recommendedBooks.map((b) => b.id) },
      },
      include: {
        author: {
          select: { name: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10 - recommendedBooks.length,
    });
    recommendedBooks = [...recommendedBooks, ...additionalBooks];
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* 1. Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="hover:text-primary flex items-center gap-1 transition-colors font-medium"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
        <span className="text-foreground font-semibold">Shopping Cart</span>
      </nav>

      {/* 2. Page Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary flex-shrink-0">
            <ShoppingBag className="size-6 sm:size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Your Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review your selected books, modify quantities, and proceed to secure checkout.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline self-start sm:self-center"
        >
          <ArrowLeft className="size-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* 3. Main Cart View (Line Items + Summary Card + Empty State) */}
      <section aria-label="Shopping Cart Details">
        <CartView />
      </section>

      {/* 4. "You might also like" Recommendation Rail */}
      {recommendedBooks.length > 0 && (
        <section
          aria-label="Book Recommendations"
          className="pt-8 sm:pt-12 border-t border-border/80"
        >
          <BookRail
            title="You Might Also Like"
            subtitle="Popular bestsellers and editor-picked recommendations for your library"
            icon={<Sparkles className="size-4 text-primary" />}
            viewAllHref="/search?sort=bestselling"
            viewAllText="View More Bestsellers"
            books={recommendedBooks}
            badgeText="Recommended"
          />
        </section>
      )}
    </div>
  );
}
