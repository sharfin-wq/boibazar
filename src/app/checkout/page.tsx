import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { ShieldCheck, Home, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Secure Checkout | BoiBazar",
  description: "Complete your order with secure delivery across Bangladesh on BoiBazar.",
};

export default async function CheckoutPage() {
  // 1. Authentication Guard
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/checkout");
  }

  // 2. Fetch User's Cart Items
  const cartItems = await prisma.cartItem.findMany({
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

  // 3. Empty Cart Guard: Redirect to /cart if cart is empty
  if (cartItems.length === 0) {
    redirect("/cart");
  }

  // 4. Fetch User's Saved Addresses
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="hover:text-primary flex items-center gap-1 transition-colors font-medium"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
        <Link href="/cart" className="hover:text-primary transition-colors font-medium">
          Shopping Cart
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
        <span className="text-foreground font-semibold">Checkout</span>
      </nav>

      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Secure Checkout
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete your book order with cash on delivery or demo card payment.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground">
          <span>Logged in as <strong>{user.name || user.email.split("@")[0]}</strong></span>
        </div>
      </div>

      {/* Main Multi-Step Checkout Flow */}
      <CheckoutFlow
        initialAddresses={addresses}
        initialCartItems={cartItems}
        user={user}
      />
    </div>
  );
}
