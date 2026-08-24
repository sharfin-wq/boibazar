import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { fetchFilteredBooks } from "@/lib/catalog";
import { BookListingView } from "@/components/listing/BookListingView";
import { Feather, ArrowLeft, BookOpen, Sparkles } from "lucide-react";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  props: AuthorPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const author = await prisma.author.findUnique({
    where: { slug },
    include: {
      _count: { select: { books: true } },
    },
  });

  if (!author) {
    return {
      title: "Author Not Found | BoiBazar",
    };
  }

  return {
    title: `${author.name} Books & Biography | BoiBazar`,
    description: author.bio ? author.bio.slice(0, 160) : `Discover books written by ${author.name} on BoiBazar. Read biography, reviews, and order books online.`,
    openGraph: {
      title: `${author.name} - Author on BoiBazar`,
      description: author.bio ? author.bio.slice(0, 160) : `Explore ${author._count.books} books by ${author.name}.`,
      images: author.photoUrl ? [{ url: author.photoUrl }] : [],
    },
  };
}

export default async function AuthorPage(props: AuthorPageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const author = await prisma.author.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { books: true },
      },
    },
  });

  if (!author) {
    notFound();
  }

  const { books, totalCount, currentPage, pageSize, facets } =
    await fetchFilteredBooks({
      authorSlug: slug,
      params: searchParams || {},
      pageSize: 24,
    });

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/authors" className="hover:text-primary transition-colors">
          Authors
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate">{author.name}</span>
      </nav>

      {/* Author Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Author Avatar */}
        <div className="relative size-28 sm:size-36 rounded-2xl overflow-hidden bg-muted border-2 border-primary/20 shadow-md flex-shrink-0">
          {author.photoUrl ? (
            <Image
              src={author.photoUrl}
              alt={author.name}
              fill
              className="object-cover"
              sizes="144px"
              unoptimized
            />
          ) : (
            <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold text-3xl">
              {author.name[0]}
            </div>
          )}
        </div>

        {/* Author Details */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Feather className="h-3.5 w-3.5" />
                <span>Featured Author</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {author.name}
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground self-center md:self-auto">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>{author._count.books} {author._count.books === 1 ? "Book" : "Books"} in Catalog</span>
            </div>
          </div>

          {author.bio && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {author.bio}
            </p>
          )}
        </div>
      </div>

      {/* Author's Books Listing */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            Books by {author.name}
          </h2>
        </div>

        <BookListingView
          books={books}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          facets={facets}
          emptyTitle={`No books found by ${author.name}`}
          emptyDescription="Try clearing your filters to view all available titles by this author."
        />
      </div>
    </div>
  );
}
