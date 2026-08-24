"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  BookOpen,
  Sparkles,
} from "lucide-react";

export function CartView() {
  const {
    items,
    totalItems,
    subtotal,
    shippingFee,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    isHydrated,
  } = useCart();

  // Skeleton loading state before hydration
  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-8 w-48 bg-muted rounded-xl mb-4" />
          <div className="h-28 bg-muted rounded-2xl" />
          <div className="h-28 bg-muted rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-72 bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  // 1. Empty Cart State
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24 px-4 text-center rounded-3xl bg-card border border-dashed border-border space-y-6 max-w-2xl mx-auto shadow-xs">
        <div className="mx-auto size-20 sm:size-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
          <ShoppingBag className="size-10 sm:size-12 stroke-[1.5]" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Your Cart is Currently Empty
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Looks like you haven&apos;t added any books to your cart yet. Explore thousands of Bengali and English titles across genres!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md gap-2">
              <BookOpen className="size-4" />
              <span>Browse Books</span>
            </Button>
          </Link>

          <Link href="/search?sort=bestselling">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-sm border-border hover:bg-muted gap-2"
            >
              <Sparkles className="size-4 text-amber-500" />
              <span>View Bestsellers</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Active Cart View
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      {/* LEFT: Line Items List */}
      <div className="lg:col-span-8 space-y-4">
        {/* Top bar with count & clear */}
        <div className="flex items-center justify-between pb-2 border-b border-border/80">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Cart Items
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {totalItems} {totalItems === 1 ? "Book" : "Books"}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8 px-2.5"
          >
            <Trash2 className="size-3.5" />
            <span>Clear Cart</span>
          </Button>
        </div>

        {/* Line item cards */}
        <div className="space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={item.bookId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Order Summary Card (Sticky) */}
      <div className="lg:col-span-4 sticky top-24">
        <CartSummary
          subtotal={subtotal}
          shippingFee={shippingFee}
          totalPrice={totalPrice}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
