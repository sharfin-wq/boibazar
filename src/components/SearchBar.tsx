"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookSuggestion {
  id: string;
  slug: string;
  title: string;
  price: number;
  discountPrice?: number | null;
  coverImageUrl: string;
  author: {
    name: string;
  };
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onNavigate?: () => void;
}

export function SearchBar({
  className,
  placeholder = "Search books by title, author, or keyword...",
  onNavigate,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<BookSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Debounced search query fetch
  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search suggestion fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectSuggestion = (book: BookSuggestion) => {
    setIsOpen(false);
    onNavigate?.();
    router.push(`/book/${book.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (suggestions.length > 0 && query.trim().length >= 2) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-11 pl-10 pr-24 rounded-full bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground placeholder:text-muted-foreground transition-all outline-none"
            aria-label="Search books"
            autoComplete="off"
          />

          {/* Right Action Icons in Input */}
          <div className="absolute right-2 flex items-center gap-1">
            {isLoading && (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin mr-1" />
            )}
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors mr-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="h-8 px-3.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>

      {/* Live Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-popover text-popover-foreground border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-98 duration-150">
          <div className="p-2 border-b border-border/60 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground px-3">
            <span className="font-medium">Book Suggestions</span>
            <span>{suggestions.length} results</span>
          </div>

          <ul className="py-1 max-h-[380px] overflow-y-auto divide-y divide-border/40" role="listbox">
            {suggestions.map((book, index) => {
              const isSelected = index === selectedIndex;
              const hasDiscount = book.discountPrice && book.discountPrice < book.price;

              return (
                <li
                  key={book.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelectSuggestion(book)}
                  className={cn(
                    "flex items-center gap-3 p-3 cursor-pointer transition-colors text-left",
                    isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
                  )}
                >
                  {/* Book Cover Thumbnail */}
                  <div className="relative w-10 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/60 shadow-2xs">
                    {book.coverImageUrl ? (
                      <Image
                        src={book.coverImageUrl}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{book.author.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-primary">
                        ৳{Math.round(hasDiscount ? (book.discountPrice as number) : book.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-muted-foreground line-through">
                          ৳{Math.round(book.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-40 group-hover:opacity-100" />
                </li>
              );
            })}
          </ul>

          {/* Bottom View All CTA */}
          <div
            onClick={handleSearchSubmit}
            className="p-2.5 bg-muted/40 hover:bg-primary/10 border-t border-border flex items-center justify-center gap-1.5 text-xs font-semibold text-primary cursor-pointer transition-colors"
          >
            <span>View all search results for &ldquo;{query}&rdquo;</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      )}
    </div>
  );
}
