import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Rocket,
  BookMarked,
  Flame,
  Smile,
  Scroll,
  Layers,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryQuickLinkItem {
  id: string;
  slug: string;
  name: string;
  bookCount?: number;
}

interface CategoryQuickLinksProps {
  categories: CategoryQuickLinkItem[];
}

const categoryStyles: Record<
  string,
  { icon: React.ReactNode; bg: string; text: string; ring: string }
> = {
  fiction: {
    icon: <BookOpen className="h-6 w-6" />,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "group-hover:border-emerald-500/50",
  },
  "non-fiction": {
    icon: <BookMarked className="h-6 w-6" />,
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    ring: "group-hover:border-blue-500/50",
  },
  "self-help-motivational": {
    icon: <Sparkles className="h-6 w-6" />,
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    ring: "group-hover:border-amber-500/50",
  },
  religious: {
    icon: <Flame className="h-6 w-6" />,
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    ring: "group-hover:border-rose-500/50",
  },
  "childrens-books": {
    icon: <Smile className="h-6 w-6" />,
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
    ring: "group-hover:border-pink-500/50",
  },
  academic: {
    icon: <GraduationCap className="h-6 w-6" />,
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    ring: "group-hover:border-indigo-500/50",
  },
  "sci-fi-fantasy": {
    icon: <Rocket className="h-6 w-6" />,
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    ring: "group-hover:border-purple-500/50",
  },
  "biography-memoir": {
    icon: <Scroll className="h-6 w-6" />,
    bg: "bg-teal-500/10 dark:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    ring: "group-hover:border-teal-500/50",
  },
};

export function CategoryQuickLinks({ categories }: CategoryQuickLinksProps) {
  return (
    <section className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore literature categorized by genre, topic, and academic discipline
          </p>
        </div>

        <Link
          href="/search"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group"
        >
          <span>All Categories</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Horizontally scrollable row on mobile / Grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-3.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar snap-x snap-mandatory">
        {categories.map((cat) => {
          const style = categoryStyles[cat.slug] || {
            icon: <BookOpen className="h-6 w-6" />,
            bg: "bg-primary/10",
            text: "text-primary",
            ring: "group-hover:border-primary/50",
          };

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={cn(
                "group relative flex flex-col items-center justify-center p-4 sm:p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs hover:shadow-md transition-all duration-200 text-center min-w-[130px] sm:min-w-0 snap-start flex-shrink-0",
                style.ring
              )}
            >
              {/* Category Icon Container */}
              <div
                className={cn(
                  "p-3 rounded-2xl transition-transform duration-200 group-hover:scale-110 mb-2.5",
                  style.bg,
                  style.text
                )}
              >
                {style.icon}
              </div>

              {/* Category Name */}
              <span className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {cat.name}
              </span>

              {/* Book count badge */}
              {cat.bookCount !== undefined && (
                <span className="text-[10px] text-muted-foreground mt-1">
                  {cat.bookCount} {cat.bookCount === 1 ? "Book" : "Books"}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
