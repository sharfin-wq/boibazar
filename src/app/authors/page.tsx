import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Feather, ArrowLeft, BookOpen, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Authors Directory | BoiBazar",
  description: "Browse all featured Bengali and international authors on BoiBazar. Explore biographies and book collections.",
};

export default async function AuthorsDirectoryPage() {
  const authors = await prisma.author.findMany({
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
        <span className="text-foreground font-semibold">Authors Directory</span>
      </nav>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Feather className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Authors Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore prominent novelists, poets, scholars, and visionary voices in Bengali literature.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{authors.length} Authors in Catalog</span>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/author/${author.slug}`}
            className="group flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border/80 shadow-2xs hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
          >
            {/* Avatar */}
            <div className="relative size-24 rounded-full p-1 bg-gradient-to-tr from-primary/30 to-amber-500/30 mb-3 group-hover:scale-105 transition-transform duration-300">
              <div className="relative size-full rounded-full overflow-hidden bg-muted border-2 border-background">
                {author.photoUrl ? (
                  <Image
                    src={author.photoUrl}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                  />
                ) : (
                  <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                    {author.name[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Author Name */}
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {author.name}
            </h3>

            {/* Books Count */}
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1 px-2.5 py-0.5 rounded-full bg-muted/60">
              <BookOpen className="h-3 w-3 text-primary" />
              <span>{author._count.books} {author._count.books === 1 ? "Book" : "Books"}</span>
            </div>

            {/* Bio snippet */}
            {author.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2.5 leading-relaxed">
                {author.bio}
              </p>
            )}

            {/* CTA */}
            <div className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Books</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
