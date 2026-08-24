import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SearchBar } from "@/components/SearchBar";
import { CategoryNav } from "@/components/CategoryNav";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { HeaderCartButton } from "@/components/cart/HeaderCartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { HeaderUserDropdown } from "@/components/account/HeaderUserDropdown";
import {
  BookOpen,
  User,
  Heart,
  Phone,
  RotateCcw,
  Palette,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export async function Header() {
  const [user, categories] = await Promise.all([
    getCurrentUser(),
    prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-xs">
      {/* 1. Slim Top Utility Bar */}
      <div className="w-full border-b border-border/50 bg-muted/40 text-xs text-muted-foreground hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
          {/* Left: Customer Care & Tagline */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-foreground/80 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Free delivery on orders over ৳1,000</span>
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-primary" />
              <span>Customer Hotline: <strong className="text-foreground font-semibold">+880 9612-000000</strong></span>
            </span>
            <span className="text-border hidden lg:inline">|</span>
            <span className="hidden lg:flex items-center gap-1">
              <RotateCcw className="h-3 w-3 text-emerald-600" />
              <span>7-Day Easy Returns</span>
            </span>
          </div>

          {/* Right: Auth state, Style Guide, Orders */}
          <div className="flex items-center gap-4 font-medium">
            <Link
              href="/style-guide"
              className="flex items-center gap-1 hover:text-primary transition-colors text-muted-foreground"
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Style Guide</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account/orders"
                  className="flex items-center gap-1 hover:text-primary transition-colors text-muted-foreground"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Orders</span>
                </Link>
                <span className="text-border">|</span>
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Hello, <strong>{user.name || user.email.split("@")[0]}</strong></span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors text-foreground"
                >
                  Sign in
                </Link>
                <span className="text-border">/</span>
                <Link
                  href="/register"
                  className="hover:text-primary transition-colors text-primary font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Trigger + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <MobileNavDrawer categories={categories} user={user} />

          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl text-primary hover:opacity-90 transition-opacity"
          >
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-xl sm:text-2xl font-extrabold tracking-tight">
                BoiBazar
              </span>
              <span className="text-[10px] text-muted-foreground font-normal tracking-wide hidden sm:inline-block mt-0.5">
                বইবাজার • Online Book Shop
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Prominent Search Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <SearchBar />
        </div>

        {/* Right: Actions (Wishlist, Cart Badge, User Auth) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Wishlist Link */}
          <Link
            href="/account/wishlist"
            className="p-2 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-muted transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Interactive Cart Button (Opens Drawer) */}
          <HeaderCartButton />

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border">
            {user ? (
              <HeaderUserDropdown user={user} />
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-xs h-8 px-3">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs h-8 px-3.5 shadow-xs"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Preview Drawer */}
      <CartDrawer />

      {/* 3. Category Navigation Bar */}
      <CategoryNav categories={categories} />
    </header>
  );
}
