import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BookProductView } from "@/components/book/BookProductView";
import { BookTabs } from "@/components/book/BookTabs";
import { BookRail } from "@/components/home/BookRail";
import { Sparkles, ChevronRight, Home } from "lucide-react";

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: BookPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const book = await prisma.book.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!book) {
    return {
      title: "Book Not Found | BoiBazar",
    };
  }

  return {
    title: `${book.title} - ${book.author.name} | BoiBazar`,
    description: book.description ? book.description.slice(0, 160) : `Buy ${book.title} by ${book.author.name} online at best price in Bangladesh on BoiBazar.`,
    openGraph: {
      title: `${book.title} - ${book.author.name}`,
      description: book.description ? book.description.slice(0, 160) : `Buy ${book.title} online at BoiBazar.`,
      images: book.coverImageUrl ? [{ url: book.coverImageUrl }] : [],
    },
  };
}

export default async function BookDetailPage(props: BookPageProps) {
  const { slug } = await props.params;

  // 1. Fetch Book with Relations, Reviews, and Current User session
  const [book, currentUser] = await Promise.all([
    prisma.book.findUnique({
      where: { slug },
      include: {
        author: true,
        publisher: true,
        categories: {
          include: {
            category: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),
    getCurrentUser(),
  ]);

  if (!book) {
    notFound();
  }

  // Primary category for breadcrumb and related rail
  const primaryCategory = book.categories[0]?.category;
  const categoryIds = book.categories.map((bc) => bc.categoryId);

  // 2. Fetch Related Books from the same category (excluding current book)
  let relatedBooks = await prisma.book.findMany({
    where: {
      id: { not: book.id },
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    },
    include: {
      author: {
        select: { name: true },
      },
      reviews: {
        select: { rating: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { soldCount: "desc" }],
    take: 10,
  });

  // Fallback if very few books in same category: fetch other books by author or featured
  if (relatedBooks.length < 4) {
    const fallbackBooks = await prisma.book.findMany({
      where: {
        id: { notIn: [book.id, ...relatedBooks.map((b) => b.id)] },
        OR: [{ authorId: book.authorId }, { isFeatured: true }],
      },
      include: {
        author: {
          select: { name: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
      take: 10 - relatedBooks.length,
    });
    relatedBooks = [...relatedBooks, ...fallbackBooks];
  }

  const isUserLoggedIn = Boolean(currentUser);

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* 1. Breadcrumb Navigation: Home / [Category Name] / [Book Title] */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground flex-wrap"
      >
        <Link
          href="/"
          className="hover:text-primary flex items-center gap-1 transition-colors font-medium"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>

        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />

        {primaryCategory ? (
          <>
            <Link
              href={`/category/${primaryCategory.slug}`}
              className="hover:text-primary transition-colors font-medium"
            >
              {primaryCategory.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          </>
        ) : (
          <>
            <Link href="/search" className="hover:text-primary transition-colors font-medium">
              Books
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          </>
        )}

        <span className="text-foreground font-semibold truncate max-w-xs sm:max-w-md md:max-w-lg">
          {book.title}
        </span>
      </nav>

      {/* 2. Top Two-Column Product View (Left: Cover Zoom, Right: Book Info, PriceTag, StockBadge, Quantity, Add to Cart/Wishlist) */}
      <section aria-label="Book summary and purchase options">
        <BookProductView book={book} />
      </section>

      {/* 3. Below Hero: Tabs for "Description", "Book Details", and "Reviews" */}
      <section aria-label="Book specifications and customer reviews" className="pt-2">
        <BookTabs
          book={book}
          isLoggedIn={isUserLoggedIn}
          currentUser={currentUser}
        />
      </section>

      {/* 4. "Related Books" Rail at Bottom */}
      {relatedBooks.length > 0 && (
        <section className="pt-6 sm:pt-10 border-t border-border/80" aria-label="Related books">
          <BookRail
            title="Related Books"
            subtitle={
              primaryCategory
                ? `More books from ${primaryCategory.name} you may like`
                : "Explore more popular titles from our catalog"
            }
            icon={<Sparkles className="size-4" />}
            books={relatedBooks}
            viewAllHref={primaryCategory ? `/category/${primaryCategory.slug}` : "/search"}
            viewAllText="Explore Category"
          />
        </section>
      )}
    </div>
  );
}
