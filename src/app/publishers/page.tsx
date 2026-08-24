import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Building2, ArrowLeft, BookOpen, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Publishers Directory | BoiBazar",
  description: "Explore all major publishing houses and publications in Bangladesh on BoiBazar. Find catalog collections and new releases.",
};

export default async function PublishersDirectoryPage() {
  const publishers = await prisma.publisher.findMany({
    include: {
      _count: {
        select: { books: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Publishers Directory</span>
      </nav>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Publishers Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Browse publications from authentic and verified publishing houses across Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{publishers.length} Publishers in Catalog</span>
        </div>
      </div>

      {/* Publishers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {publishers.map((publisher) => (
          <Link
            key={publisher.id}
            href={`/publisher/${publisher.slug}`}
            className="group flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border/80 shadow-2xs hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
          >
            {/* Logo / Badge */}
            <div className="relative size-20 rounded-2xl overflow-hidden bg-primary/5 border-2 border-primary/20 flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform duration-300">
              {publisher.logoUrl ? (
                <Image
                  src={publisher.logoUrl}
                  alt={publisher.name}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary">
                  <Building2 className="size-6 mb-0.5" />
                  <span className="text-[9px] font-bold uppercase">Publisher</span>
                </div>
              )}
            </div>

            {/* Publisher Name */}
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {publisher.name}
            </h3>

            {/* Books Count */}
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1 px-2.5 py-0.5 rounded-full bg-muted/60">
              <BookOpen className="h-3 w-3 text-primary" />
              <span>{publisher._count.books} {publisher._count.books === 1 ? "Book" : "Books"}</span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
              Explore authentic releases and literary titles published by {publisher.name}.
            </p>

            {/* CTA */}
            <div className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Browse Catalog</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
