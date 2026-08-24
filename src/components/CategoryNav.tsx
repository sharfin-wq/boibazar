import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  Sparkles,
  Flame,
  Smile,
  GraduationCap,
  Rocket,
  Scroll,
  BookMarked,
  LayoutGrid,
  ArrowRight,
  Tag,
  TrendingUp,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
}

interface CategoryNavProps {
  categories: CategoryItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  fiction: <BookOpen className="h-4 w-4 text-emerald-600" />,
  "non-fiction": <BookMarked className="h-4 w-4 text-blue-600" />,
  "self-help-motivational": <Sparkles className="h-4 w-4 text-amber-500" />,
  religious: <Flame className="h-4 w-4 text-rose-500" />,
  "childrens-books": <Smile className="h-4 w-4 text-pink-500" />,
  academic: <GraduationCap className="h-4 w-4 text-indigo-600" />,
  "sci-fi-fantasy": <Rocket className="h-4 w-4 text-purple-600" />,
  "biography-memoir": <Scroll className="h-4 w-4 text-teal-600" />,
};

export function CategoryNav({ categories }: CategoryNavProps) {
  return (
    <div className="hidden md:block w-full border-t border-border/60 bg-muted/20 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between text-sm font-medium text-muted-foreground overflow-x-auto no-scrollbar py-1">
          {/* All Categories Dropdown / Quick Trigger */}
          <div className="relative group py-1.5 pr-2">
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-foreground font-semibold hover:bg-muted/70 transition-colors"
            >
              <LayoutGrid className="h-4 w-4 text-primary" />
              <span>All Categories</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
            </Link>

            {/* Mega Dropdown for All Categories */}
            <div className="absolute top-full left-0 w-80 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="rounded-2xl bg-popover text-popover-foreground border border-border shadow-xl p-3 space-y-1">
                <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 flex items-center justify-between">
                  <span>Browse by Category</span>
                  <span className="text-[11px] font-normal">{categories.length} total</span>
                </div>
                <div className="grid grid-cols-1 gap-0.5 pt-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                    >
                      <div className="flex items-center gap-2.5">
                        {categoryIcons[cat.slug] || <BookOpen className="h-3.5 w-3.5 text-primary" />}
                        <span>{cat.name}</span>
                      </div>
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 8 Categories Navigation Items */}
          <div className="flex items-center gap-1 flex-1 justify-between">
            {categories.map((cat) => (
              <div key={cat.id} className="relative group py-1.5">
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium hover:text-foreground hover:bg-muted/70 transition-colors whitespace-nowrap"
                >
                  <span>{cat.name}</span>
                  <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {/* Dropdown Menu on Hover */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="rounded-xl bg-popover text-popover-foreground border border-border shadow-xl p-3 space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                      <div className="p-1.5 rounded-md bg-muted">
                        {categoryIcons[cat.slug] || <BookOpen className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{cat.name}</p>
                        <p className="text-[11px] text-muted-foreground">Curated book collection</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground font-medium transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-primary" />
                          Explore {cat.name}
                        </span>
                        <ArrowRight className="h-3 w-3 opacity-60" />
                      </Link>
                      <Link
                        href={`/category/${cat.slug}?sort=bestselling`}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                          Best Sellers
                        </span>
                      </Link>
                      <Link
                        href={`/category/${cat.slug}?discount=true`}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-emerald-500" />
                          Discount Offers
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
