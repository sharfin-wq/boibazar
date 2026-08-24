"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilterSidebar, FilterFacets } from "@/components/listing/FilterSidebar";

interface ListingTopBarProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  facets: FilterFacets;
}

const sortOptions = [
  { value: "featured", label: "Featured / Recommended" },
  { value: "bestselling", label: "Bestselling (Most Popular)" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function ListingTopBar({
  totalCount,
  currentPage,
  pageSize,
  facets,
}: ListingTopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const currentSort = searchParams.get("sort") || "featured";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const isDiscount = searchParams.get("discount") === "true";
  const isInStock = searchParams.get("inStock") === "true";
  const languages = searchParams.get("language")?.split(",").filter(Boolean) || [];
  const authors = searchParams.get("author")?.split(",").filter(Boolean) || [];
  const publishers = searchParams.get("publisher")?.split(",").filter(Boolean) || [];

  const fromCount = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toCount = Math.min(currentPage * pageSize, totalCount);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // Reset to page 1
    if (newSort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeParam = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (valueToRemove && (key === "author" || key === "publisher" || key === "language")) {
      const currentValues = params.get(key)?.split(",").filter(Boolean) || [];
      const updated = currentValues.filter((v) => v !== valueToRemove);
      if (updated.length > 0) {
        params.set(key, updated.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    if (q) params.set("q", q);
    if (category) params.set("category", category);

    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const authorMap = React.useMemo(() => {
    const map = new Map<string, string>();
    facets.authors.forEach((a) => map.set(a.slug, a.name));
    return map;
  }, [facets.authors]);

  const publisherMap = React.useMemo(() => {
    const map = new Map<string, string>();
    facets.publishers.forEach((p) => map.set(p.slug, p.name));
    return map;
  }, [facets.publishers]);

  const hasActiveFilters =
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    isDiscount ||
    isInStock ||
    languages.length > 0 ||
    authors.length > 0 ||
    publishers.length > 0;

  return (
    <div className="w-full space-y-3">
      {/* Top Row: Result count, Mobile Filter Button, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs">
        {/* Left: Results Count & Mobile Filter Trigger */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {totalCount > 0 ? (
              <>
                Showing <strong className="text-foreground">{fromCount}–{toCount}</strong> of{" "}
                <strong className="text-foreground">{totalCount}</strong> books
              </>
            ) : (
              "No books found"
            )}
          </p>

          {/* Mobile Filter Trigger Sheet */}
          <div className="sm:hidden">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs gap-1.5 border-border"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </Button>
                }
              />
              <SheetContent side="left" className="w-[85vw] sm:max-w-sm p-4 overflow-y-auto">
                <SheetHeader className="p-0 pb-3 mb-3 border-b border-border">
                  <SheetTitle className="text-base font-bold">Catalog Filters</SheetTitle>
                </SheetHeader>
                <FilterSidebar
                  facets={facets}
                  onFilterChange={() => setIsMobileFilterOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Right: Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs text-muted-foreground flex items-center gap-1 font-medium whitespace-nowrap">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            <span>Sort by:</span>
          </label>

          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-8 pl-2.5 pr-8 rounded-lg bg-background border border-border text-xs text-foreground font-medium focus:border-primary focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-xs font-semibold text-muted-foreground">Active Filters:</span>

          {/* Discount Chip */}
          {isDiscount && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <span>Discounted Only</span>
              <button
                type="button"
                onClick={() => removeParam("discount")}
                className="hover:opacity-75"
                aria-label="Remove discount filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* In Stock Chip */}
          {isInStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={() => removeParam("inStock")}
                className="hover:opacity-75"
                aria-label="Remove in-stock filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Price Range Chip */}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium border border-border">
              <span>
                Price: ৳{minPrice || "0"} – ৳{maxPrice || "Max"}
              </span>
              <button
                type="button"
                onClick={() => {
                  removeParam("minPrice");
                  removeParam("maxPrice");
                }}
                className="hover:opacity-75"
                aria-label="Remove price filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Language Chips */}
          {languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium border border-border"
            >
              <span>Lang: {lang}</span>
              <button
                type="button"
                onClick={() => removeParam("language", lang)}
                className="hover:opacity-75"
                aria-label={`Remove ${lang} language filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Author Chips */}
          {authors.map((authorSlug) => (
            <span
              key={authorSlug}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium border border-border"
            >
              <span>Author: {authorMap.get(authorSlug) || authorSlug}</span>
              <button
                type="button"
                onClick={() => removeParam("author", authorSlug)}
                className="hover:opacity-75"
                aria-label={`Remove author filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Publisher Chips */}
          {publishers.map((pubSlug) => (
            <span
              key={pubSlug}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-medium border border-border"
            >
              <span>Pub: {publisherMap.get(pubSlug) || pubSlug}</span>
              <button
                type="button"
                onClick={() => removeParam("publisher", pubSlug)}
                className="hover:opacity-75"
                aria-label={`Remove publisher filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Clear All Button */}
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1 ml-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
}
