import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { fetchFilteredBooks } from "@/lib/catalog";
import { BookListingView } from "@/components/listing/BookListingView";
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  Flame,
  Smile,
  GraduationCap,
  Rocket,
  Scroll,
  BookMarked,
} from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  props: CategoryPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: "Category Not Found | BoiBazar",
    };
  }

  return {
    title: `${category.name} Books | BoiBazar`,
    description: `Explore and buy ${category.name} books online on BoiBazar. Best prices, discounts, and fast delivery across Bangladesh.`,
    openGraph: {
      title: `${category.name} Books - BoiBazar`,
      description: `Browse bestselling and new ${category.name} books at BoiBazar.`,
    },
  };
}

const categoryIcons: Record<string, React.ReactNode> = {
  fiction: <BookOpen className="h-6 w-6 text-emerald-600" />,
  "non-fiction": <BookMarked className="h-6 w-6 text-blue-600" />,
  "self-help-motivational": <Sparkles className="h-6 w-6 text-amber-500" />,
  religious: <Flame className="h-6 w-6 text-rose-500" />,
  "childrens-books": <Smile className="h-6 w-6 text-pink-500" />,
  academic: <GraduationCap className="h-6 w-6 text-indigo-600" />,
  "sci-fi-fantasy": <Rocket className="h-6 w-6 text-purple-600" />,
  "biography-memoir": <Scroll className="h-6 w-6 text-teal-600" />,
};

export default async function CategoryPage(props: CategoryPageProps) {
  const rawParams = await props.params;
  const slug = rawParams?.slug;
  const searchParams = (await props.searchParams) || {};

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const { books, totalCount, currentPage, pageSize, facets } =
    await fetchFilteredBooks({
      categorySlug: slug,
      params: searchParams,
      pageSize: 24,
    });

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/search" className="hover:text-primary transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate">{category.name}</span>
      </nav>

      {/* Category Header Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
            {categoryIcons[category.slug] || <BookOpen className="h-6 w-6 text-primary" />}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {category.name} Books
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Browse our complete collection of {category.name.toLowerCase()} literature, bestsellers, new editions, and discounted titles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground flex-shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{totalCount} {totalCount === 1 ? "Book" : "Books"} Available</span>
        </div>
      </div>

      {/* Main Listing View (Filters + Top Bar + Grid + Pagination) */}
      <BookListingView
        books={books}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        facets={facets}
        emptyTitle={`No books found in ${category.name}`}
        emptyDescription="Try adjusting your filters, price range, or language preferences."
      />
    </div>
  );
}
