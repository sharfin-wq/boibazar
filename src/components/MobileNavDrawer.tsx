"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { SignOutButton } from "@/components/SignOutButton";
import {
  Menu,
  BookOpen,
  Sparkles,
  GraduationCap,
  Rocket,
  BookMarked,
  Flame,
  Smile,
  Scroll,
  ShoppingBag,
  Heart,
  MapPin,
  Palette,
  Phone,
  Truck,
  ShieldCheck,
  ChevronRight,
  LogIn,
  UserPlus,
} from "lucide-react";

interface CategoryItem {
  id: string;
  slug: string;
  name: string;
}

interface MobileNavDrawerProps {
  categories: CategoryItem[];
  user?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;
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

export function MobileNavDrawer({ categories, user }: MobileNavDrawerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-muted"
            aria-label="Open Navigation Menu"
          />
        }
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] sm:max-w-md p-0 flex flex-col bg-background">
        <SheetHeader className="p-4 border-b border-border bg-card/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-foreground leading-tight">
                BoiBazar
              </SheetTitle>
              <p className="text-xs text-muted-foreground">বইবাজার • Online Book Shop</p>
            </div>
          </div>
        </SheetHeader>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Quick Search */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Search Catalog
            </p>
            <SearchBar onNavigate={() => setOpen(false)} placeholder="Search books, authors..." />
          </div>

          {/* User Account Quick Section */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-3">
            {user ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name || "Book Reader"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1 text-xs">
                  <Link
                    href="/account/orders"
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-background border border-border hover:border-primary text-foreground transition-colors text-center gap-1"
                  >
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-medium">Orders</span>
                  </Link>
                  <Link
                    href="/account/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-background border border-border hover:border-primary text-foreground transition-colors text-center gap-1"
                  >
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="text-[11px] font-medium">Wishlist</span>
                  </Link>
                  <Link
                    href="/account/addresses"
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-background border border-border hover:border-primary text-foreground transition-colors text-center gap-1"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-medium">Addresses</span>
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Profile Overview
                  </Link>
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Sign in to track orders and save your wishlist</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      <LogIn className="h-3.5 w-3.5" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full text-xs gap-1 bg-primary text-primary-foreground">
                      <UserPlus className="h-3.5 w-3.5" />
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Book Categories ({categories.length})
              </span>
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Browse All
              </Link>
            </div>

            <div className="divide-y divide-border/50 rounded-xl border border-border bg-card overflow-hidden">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-3 text-sm text-foreground hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-muted flex-shrink-0">
                      {categoryIcons[cat.slug] || <BookOpen className="h-4 w-4 text-primary" />}
                    </span>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-60" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Explore Directories
            </span>
            <div className="flex flex-col gap-1 text-sm">
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-medium text-foreground"
              >
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>Shopping Cart</span>
              </Link>
              <Link
                href="/authors"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Authors Directory</span>
              </Link>
              <Link
                href="/publishers"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <BookMarked className="h-4 w-4 text-primary" />
                <span>Publishers Directory</span>
              </Link>
              <Link
                href="/style-guide"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Palette className="h-4 w-4 text-primary" />
                <span>Design System & Style Guide</span>
              </Link>
            </div>
          </div>

          {/* Customer Care Note */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>Customer Care Hotline</span>
            </div>
            <p>+880 9612-000000 (9 AM - 10 PM daily)</p>
            <div className="flex items-center gap-3 pt-1 text-[11px]">
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3 text-primary" /> Fast Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" /> 7-Day Returns
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
