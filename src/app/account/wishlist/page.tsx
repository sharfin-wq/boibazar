import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WishlistView } from "@/components/account/WishlistView";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Home, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "My Wishlist | BoiBazar",
  description: "View and manage your saved books on BoiBazar.",
};

export default async function WishlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account/wishlist");
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: {
      book: {
        select: {
          id: true,
          slug: true,
          title: true,
          coverImageUrl: true,
          price: true,
          discountPrice: true,
          stock: true,
          author: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="hover:text-primary flex items-center gap-1 transition-colors font-medium"
        >
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
        <Link
          href="/account"
          className="hover:text-primary transition-colors font-medium"
        >
          My Account
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
        <span className="text-foreground font-semibold">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Heart className="size-7 text-rose-500 fill-rose-500" />
            <span>My Wishlist</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Books you have saved to purchase or read later
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/account">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Account</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Wishlist Grid */}
      <WishlistView initialItems={items} />
    </div>
  );
}
