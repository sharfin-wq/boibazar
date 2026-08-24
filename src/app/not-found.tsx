import Link from "next/link";
import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Home,
  Compass,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | BoiBazar",
  description: "Sorry, the page or book you are looking for does not exist on BoiBazar.",
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Visual 404 Badge with Book Hero */}
        <div className="relative inline-flex items-center justify-center">
          <div className="size-24 sm:size-32 rounded-3xl bg-primary/10 border-2 border-primary/20 text-primary flex items-center justify-center shadow-lg shadow-primary/10">
            <BookOpen className="size-12 sm:size-16 stroke-[1.5]" />
          </div>
          <span className="absolute -top-3 -right-3 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-black font-mono shadow-md">
            404
          </span>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Lost Between the Pages?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            The book or page you are looking for might have been misplaced, renamed, or is temporarily unavailable in our catalog.
          </p>
        </div>

        {/* Search Bar Helper */}
        <div className="max-w-md mx-auto pt-2">
          <div className="p-2 rounded-2xl bg-card border border-border/80 shadow-sm">
            <SearchBar placeholder="Search for title, author, or publisher..." />
          </div>
        </div>

        {/* Quick Links & CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md gap-2">
              <Home className="size-4" />
              <span>Back to Homepage</span>
            </Button>
          </Link>

          <Link href="/category/fiction">
            <Button
              variant="outline"
              className="h-11 px-6 rounded-xl font-bold text-xs border-border hover:bg-muted gap-2"
            >
              <Compass className="size-4 text-primary" />
              <span>Explore Fiction</span>
            </Button>
          </Link>

          <Link href="/search">
            <Button
              variant="ghost"
              className="h-11 px-6 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground gap-2"
            >
              <Sparkles className="size-4 text-amber-500" />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
