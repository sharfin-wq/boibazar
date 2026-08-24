import Link from "next/link";
import type { Metadata } from "next";
import { fetchFilteredBooks } from "@/lib/catalog";
import { BookListingView } from "@/components/listing/BookListingView";
import { Search, ArrowLeft, Layers } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  props: SearchPageProps
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const rawQ = searchParams?.q;
  const query = typeof rawQ === "string" ? rawQ.trim() : "";

  return {
    title: query ? `"${query}" - Search Results | BoiBazar` : "Search & Explore Books | BoiBazar",
    description: query
      ? `Find books matching "${query}" on BoiBazar. Best prices, book reviews, and home delivery across Bangladesh.`
      : "Search thousands of Bengali books by title, author, genre, or publisher on BoiBazar.",
  };
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const rawQ = searchParams?.q;
  const query = typeof rawQ === "string" ? rawQ.trim() : "";
  const rawCat = searchParams?.category;
  const categorySlug = typeof rawCat === "string" ? rawCat.trim() : "";

  const { books, totalCount, currentPage, pageSize, facets } =
    await fetchFilteredBooks({
      categorySlug: categorySlug || undefined,
      searchQuery: query || undefined,
      params: searchParams,
      pageSize: 24,
    });

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Breadcrumb / Back */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Search Catalog</span>
      </nav>

      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {query ? (
                <>
                  Search Results for <span className="text-primary">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                "Search & Explore Catalog"
              )}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {query
              ? `Showing books matching "${query}". Use sidebar filters to refine by price, author, or publisher.`
              : "Discover books across all genres, authors, and publishers in our catalog."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span>{totalCount} {totalCount === 1 ? "Result" : "Results"} Found</span>
        </div>
      </div>

      {/* Main Listing View (Filters + Top Bar + Grid + Pagination) */}
      <BookListingView
        books={books}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        facets={facets}
        emptyTitle={query ? `No books found for "${query}"` : "No books match your filters"}
        emptyDescription="Try searching for a different author, title keyword, or resetting your filter criteria."
      />
    </div>
  );
}
