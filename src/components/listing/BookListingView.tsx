import * as React from "react";
import Link from "next/link";
import { BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractiveBookCard } from "@/components/home/InteractiveBookCard";
import { FilterSidebar, FilterFacets } from "@/components/listing/FilterSidebar";
import { ListingTopBar } from "@/components/listing/ListingTopBar";
import { PaginationControls } from "@/components/listing/PaginationControls";

export interface BookListingItem {
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

interface BookListingViewProps {
  books: BookListingItem[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
  facets: FilterFacets;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function BookListingView({
  books,
  totalCount,
  currentPage,
  pageSize = 24,
  facets,
  emptyTitle = "No books match your filters",
  emptyDescription = "Try widening your price range, selecting different authors, or resetting your active filters.",
}: BookListingViewProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-8">
      {/* Left Sidebar Filter (Desktop) */}
      <div className="hidden md:block w-64 flex-shrink-0 sticky top-24">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs">
          <FilterSidebar facets={facets} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-6">
        {/* Top Control Bar (Sort, count, mobile filter trigger, active filter chips) */}
        <ListingTopBar
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          facets={facets}
        />

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                  href={`/book/${book.slug}`}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
            <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <BookOpen className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">{emptyTitle}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {emptyDescription}
              </p>
            </div>
            <Link href="?">
              <Button variant="outline" size="sm" className="gap-1.5 mt-2">
                <RotateCcw className="size-3.5" />
                <span>Reset All Filters</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination Controls */}
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
