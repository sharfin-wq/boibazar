"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  Check,
  Tag,
  BookOpen,
  Building2,
  Globe,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface FacetOption {
  id: string;
  slug: string;
  name: string;
  count?: number;
}

export interface FilterFacets {
  authors: FacetOption[];
  publishers: FacetOption[];
  languages: { name: string; count?: number }[];
  minPrice: number;
  maxPrice: number;
}

interface FilterSidebarProps {
  facets: FilterFacets;
  className?: string;
  onFilterChange?: () => void;
}

export function FilterSidebar({
  facets,
  className,
  onFilterChange,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current filter state from URL search params
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const isDiscountOnly = searchParams.get("discount") === "true";
  const isInStockOnly = searchParams.get("inStock") === "true";
  const selectedLanguages = React.useMemo(
    () => searchParams.get("language")?.split(",").filter(Boolean) || [],
    [searchParams]
  );
  const selectedAuthors = React.useMemo(
    () => searchParams.get("author")?.split(",").filter(Boolean) || [],
    [searchParams]
  );
  const selectedPublishers = React.useMemo(
    () => searchParams.get("publisher")?.split(",").filter(Boolean) || [],
    [searchParams]
  );

  // Local price inputs
  const [minPriceInput, setMinPriceInput] = React.useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = React.useState(currentMaxPrice);

  // Local search filter for authors/publishers list
  const [authorFilterQuery, setAuthorFilterQuery] = React.useState("");
  const [publisherFilterQuery, setPublisherFilterQuery] = React.useState("");

  // Sync inputs when URL changes
  React.useEffect(() => {
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  // Helper to update URL search params
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination to page 1 on filter change
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
    onFilterChange?.();
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({
      minPrice: minPriceInput.trim() || null,
      maxPrice: maxPriceInput.trim() || null,
    });
  };

  const handleToggleDiscount = (checked: boolean) => {
    updateQueryParams({ discount: checked ? "true" : null });
  };

  const handleToggleInStock = (checked: boolean) => {
    updateQueryParams({ inStock: checked ? "true" : null });
  };

  const handleToggleLanguage = (lang: string) => {
    const newLangs = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];
    updateQueryParams({
      language: newLangs.length > 0 ? newLangs.join(",") : null,
    });
  };

  const handleToggleAuthor = (slug: string) => {
    const newAuthors = selectedAuthors.includes(slug)
      ? selectedAuthors.filter((a) => a !== slug)
      : [...selectedAuthors, slug];
    updateQueryParams({
      author: newAuthors.length > 0 ? newAuthors.join(",") : null,
    });
  };

  const handleTogglePublisher = (slug: string) => {
    const newPublishers = selectedPublishers.includes(slug)
      ? selectedPublishers.filter((p) => p !== slug)
      : [...selectedPublishers, slug];
    updateQueryParams({
      publisher: newPublishers.length > 0 ? newPublishers.join(",") : null,
    });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    // Preserve search query and category if on /search
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    setMinPriceInput("");
    setMaxPriceInput("");
    onFilterChange?.();
  };

  const hasActiveFilters =
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice) ||
    isDiscountOnly ||
    isInStockOnly ||
    selectedLanguages.length > 0 ||
    selectedAuthors.length > 0 ||
    selectedPublishers.length > 0;

  // Filtered lists for authors & publishers search
  const visibleAuthors = facets.authors.filter((a) =>
    a.name.toLowerCase().includes(authorFilterQuery.toLowerCase())
  );

  const visiblePublishers = facets.publishers.filter((p) =>
    p.name.toLowerCase().includes(publisherFilterQuery.toLowerCase())
  );

  return (
    <aside className={cn("w-full space-y-6 text-sm", className)}>
      {/* Header with Title and Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="font-bold text-base text-foreground">Filters</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Quick Toggles (In Stock & Discounted) */}
      <div className="space-y-3 pb-5 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Availability & Offers
        </p>

        {/* Discount Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium text-xs text-foreground">Discounted Items Only</span>
          </div>
          <Checkbox
            checked={isDiscountOnly}
            onCheckedChange={(checked) => handleToggleDiscount(Boolean(checked))}
          />
        </label>

        {/* In-Stock Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <Check className="h-4 w-4 text-emerald-600" />
            <span className="font-medium text-xs text-foreground">In Stock Only</span>
          </div>
          <Checkbox
            checked={isInStockOnly}
            onCheckedChange={(checked) => handleToggleInStock(Boolean(checked))}
          />
        </label>
      </div>

      {/* 2. Price Range Filter */}
      <div className="space-y-3 pb-5 border-b border-border">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            <span>Price Range (৳)</span>
          </p>
          {(currentMinPrice || currentMaxPrice) && (
            <button
              type="button"
              onClick={() => {
                setMinPriceInput("");
                setMaxPriceInput("");
                updateQueryParams({ minPrice: null, maxPrice: null });
              }}
              className="text-[11px] text-muted-foreground hover:text-primary"
            >
              Reset
            </button>
          )}
        </div>

        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ৳
              </span>
              <input
                type="number"
                min="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                placeholder={`${facets.minPrice || 0}`}
                className="w-full h-8 pl-6 pr-2 rounded-lg bg-muted/40 border border-border text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <span className="text-muted-foreground text-xs font-medium">to</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ৳
              </span>
              <input
                type="number"
                min="0"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                placeholder={`${facets.maxPrice || 1000}`}
                className="w-full h-8 pl-6 pr-2 rounded-lg bg-muted/40 border border-border text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs font-medium border-border hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Apply Price
          </Button>
        </form>
      </div>

      {/* 3. Language Filter */}
      {facets.languages && facets.languages.length > 0 && (
        <div className="space-y-2.5 pb-5 border-b border-border">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>Language</span>
          </p>

          <div className="space-y-1.5">
            {facets.languages.map((lang) => {
              const isChecked = selectedLanguages.includes(lang.name);

              return (
                <label
                  key={lang.name}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleLanguage(lang.name)}
                    />
                    <span className="text-xs font-medium text-foreground">{lang.name}</span>
                  </div>
                  {lang.count !== undefined && (
                    <span className="text-[11px] text-muted-foreground">({lang.count})</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Author Filter */}
      {facets.authors && facets.authors.length > 0 && (
        <div className="space-y-2.5 pb-5 border-b border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Authors</span>
            </p>
            {selectedAuthors.length > 0 && (
              <span className="text-[11px] font-semibold text-primary">
                {selectedAuthors.length} selected
              </span>
            )}
          </div>

          {/* Search box for authors if list is large */}
          {facets.authors.length > 6 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={authorFilterQuery}
                onChange={(e) => setAuthorFilterQuery(e.target.value)}
                placeholder="Search authors..."
                className="w-full h-7 pl-7 pr-2 rounded-md bg-muted/40 border border-border text-xs focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Authors Scrollable Checkbox List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 no-scrollbar">
            {visibleAuthors.map((author) => {
              const isChecked = selectedAuthors.includes(author.slug);

              return (
                <label
                  key={author.id}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleAuthor(author.slug)}
                    />
                    <span className="text-xs font-medium text-foreground truncate">
                      {author.name}
                    </span>
                  </div>
                  {author.count !== undefined && (
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                      ({author.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Publisher Filter */}
      {facets.publishers && facets.publishers.length > 0 && (
        <div className="space-y-2.5 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>Publishers</span>
            </p>
            {selectedPublishers.length > 0 && (
              <span className="text-[11px] font-semibold text-primary">
                {selectedPublishers.length} selected
              </span>
            )}
          </div>

          {/* Search box for publishers if list is large */}
          {facets.publishers.length > 6 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={publisherFilterQuery}
                onChange={(e) => setPublisherFilterQuery(e.target.value)}
                placeholder="Search publishers..."
                className="w-full h-7 pl-7 pr-2 rounded-md bg-muted/40 border border-border text-xs focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Publishers Scrollable Checkbox List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 no-scrollbar">
            {visiblePublishers.map((publisher) => {
              const isChecked = selectedPublishers.includes(publisher.slug);

              return (
                <label
                  key={publisher.id}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleTogglePublisher(publisher.slug)}
                    />
                    <span className="text-xs font-medium text-foreground truncate">
                      {publisher.name}
                    </span>
                  </div>
                  {publisher.count !== undefined && (
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                      ({publisher.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
