import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { fetchFilteredBooks } from "@/lib/catalog";
import { BookListingView } from "@/components/listing/BookListingView";
import { Building2, ArrowLeft, BookOpen, Sparkles } from "lucide-react";

interface PublisherPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  props: PublisherPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const publisher = await prisma.publisher.findUnique({
    where: { slug },
    include: {
      _count: { select: { books: true } },
    },
  });

  if (!publisher) {
    return {
      title: "Publisher Not Found | BoiBazar",
    };
  }

  return {
    title: `${publisher.name} Publications | BoiBazar`,
    description: `Discover and buy books published by ${publisher.name} on BoiBazar. Genuine publications, best prices, and home delivery across Bangladesh.`,
    openGraph: {
      title: `${publisher.name} - Publisher on BoiBazar`,
      description: `Browse ${publisher._count.books} titles published by ${publisher.name} on BoiBazar.`,
      images: publisher.logoUrl ? [{ url: publisher.logoUrl }] : [],
    },
  };
}

export default async function PublisherPage(props: PublisherPageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const publisher = await prisma.publisher.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { books: true },
      },
    },
  });

  if (!publisher) {
    notFound();
  }

  const { books, totalCount, currentPage, pageSize, facets } =
    await fetchFilteredBooks({
      publisherSlug: slug,
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
        <Link href="/publishers" className="hover:text-primary transition-colors">
          Publishers
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate">{publisher.name}</span>
      </nav>

      {/* Publisher Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Publisher Logo / Badge */}
        <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden bg-primary/5 border-2 border-primary/20 shadow-md flex items-center justify-center p-3 flex-shrink-0">
          {publisher.logoUrl ? (
            <Image
              src={publisher.logoUrl}
              alt={publisher.name}
              fill
              className="object-contain p-2"
              sizes="112px"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-primary">
              <Building2 className="size-8 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Publishers</span>
            </div>
          )}
        </div>

        {/* Publisher Details */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>Verified Publisher</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {publisher.name}
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground self-center md:self-auto">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>{publisher._count.books} {publisher._count.books === 1 ? "Book" : "Books"} Published</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Explore authentic literary works, translated editions, and academic publications proudly brought to readers by {publisher.name}.
          </p>
        </div>
      </div>

      {/* Publisher's Books Listing */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            Books Published by {publisher.name}
          </h2>
        </div>

        <BookListingView
          books={books}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          facets={facets}
          emptyTitle={`No books found for ${publisher.name}`}
          emptyDescription="Try clearing your filters to view all available titles from this publisher."
        />
      </div>
    </div>
  );
}
