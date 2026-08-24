"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, FileText, Star, Tag, Building2, User, Globe, Calendar, Hash, Layers } from "lucide-react";
import { BookReviews, ReviewItem } from "@/components/book/BookReviews";
import { cn } from "@/lib/utils";

interface CategoryInfo {
  id: string;
  slug: string;
  name: string;
}

interface BookTabsProps {
  book: {
    id: string;
    slug: string;
    title: string;
    description: string;
    isbn?: string | null;
    pageCount?: number | null;
    language?: string | null;
    publishedYear?: number | null;
    stock: number;
    author: {
      name: string;
      slug: string;
    };
    publisher: {
      name: string;
      slug: string;
    };
    categories: Array<{
      category: CategoryInfo;
    }>;
    reviews: ReviewItem[];
  };
  isLoggedIn: boolean;
  currentUser?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  activeTab?: string;
}

export function BookTabs({
  book,
  isLoggedIn,
  currentUser,
}: BookTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"description" | "details" | "reviews">("description");

  const totalReviews = book.reviews?.length || 0;

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-px overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
            activeTab === "description"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          <FileText className="size-4" />
          <span>Description</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
            activeTab === "details"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          <BookOpen className="size-4" />
          <span>Book Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
            activeTab === "reviews"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          <Star className="size-4 text-amber-500" />
          <span>Reviews</span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              activeTab === "reviews"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalReviews}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {/* 1. Description Tab */}
        {activeTab === "description" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xs space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <span>About the Book</span>
            </h3>

            <div className="text-sm sm:text-base text-foreground/90 leading-relaxed space-y-4 max-w-4xl">
              {book.description ? (
                book.description
                  .split("\n\n")
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))
              ) : (
                <p className="text-muted-foreground italic">
                  No synopsis or description currently provided for this edition.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2. Book Details Tab */}
        {activeTab === "details" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xs space-y-6 animate-in fade-in-50 duration-200">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <span>Specification & Book Details</span>
            </h3>

            {/* Key-Value Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* ISBN */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="p-2 rounded-xl bg-card border border-border text-primary shrink-0">
                  <Hash className="size-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase font-medium">ISBN</span>
                  <p className="text-sm font-semibold text-foreground font-mono truncate">
                    {book.isbn || "978-984-0000-00-0"}
                  </p>
                </div>
              </div>

              {/* Page Count */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="p-2 rounded-xl bg-card border border-border text-primary shrink-0">
                  <Layers className="size-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Page Count</span>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {book.pageCount ? `${book.pageCount} Pages` : "Not specified"}
                  </p>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="p-2 rounded-xl bg-card border border-border text-primary shrink-0">
                  <Globe className="size-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Language</span>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {book.language || "Bengali"}
                  </p>
                </div>
              </div>

              {/* Published Year */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="p-2 rounded-xl bg-card border border-border text-primary shrink-0">
                  <Calendar className="size-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Published Year</span>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {book.publishedYear || "Recent Edition"}
                  </p>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="p-2 rounded-xl bg-card border border-border text-primary shrink-0">
                  <User className="size-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Author</span>
                  <p className="text-sm font-semibold text-foreground truncate">
                    <Link
                      href={`/author/${book.author.slug}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {book.author.name}
                    </Link>
                  </p>
                </div>
              </div>

              {/* Publisher */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="p-2 rounded-xl bg-card border border-border text-primary shrink-0">
                  <Building2 className="size-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Publisher</span>
                  <p className="text-sm font-semibold text-foreground truncate">
                    <Link
                      href={`/publisher/${book.publisher.slug}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {book.publisher.name}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Categories list */}
            {book.categories && book.categories.length > 0 && (
              <div className="pt-2 border-t border-border flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Tag className="size-3.5 text-primary" />
                  <span>Categories:</span>
                </span>
                {book.categories.map(({ category }) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border transition-colors font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="animate-in fade-in-50 duration-200">
            <BookReviews
              bookSlug={book.slug}
              bookTitle={book.title}
              initialReviews={book.reviews}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}
