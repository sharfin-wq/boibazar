"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/context/CartContext";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Truck,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    totalItems,
    subtotal,
    shippingFee,
    totalPrice,
    updateQuantity,
    removeItem,
  } = useCart();

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-background h-full shadow-2xl border-l border-border"
      >
        {/* Header */}
        <SheetHeader className="p-4 sm:p-5 border-b border-border bg-card/60">
          <div className="flex items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ShoppingCart className="size-5" />
              </div>
              <div>
                <SheetTitle className="text-base sm:text-lg font-bold text-foreground leading-tight">
                  Shopping Cart
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              </div>
            </div>
          </div>

          {/* Free Shipping Progress Indicator (if items exist) */}
          {items.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Truck className="size-3.5 text-primary" />
                  {freeShippingRemaining > 0 ? (
                    <>
                      Add <strong className="text-foreground">৳{freeShippingRemaining.toLocaleString()}</strong> more for FREE delivery
                    </>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="size-3.5" /> FREE delivery unlocked!
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground text-[11px] font-semibold">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        {/* Body Content */}
        {items.length > 0 ? (
          <>
            {/* Scrollable Line Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-4 sm:p-5 space-y-4">
              {items.map((item) => {
                const effectivePrice =
                  item.book.discountPrice !== null &&
                  item.book.discountPrice !== undefined &&
                  item.book.discountPrice < item.book.price
                    ? item.book.discountPrice
                    : item.book.price;
                const originalPrice =
                  item.book.discountPrice && item.book.discountPrice < item.book.price
                    ? item.book.price
                    : null;
                const lineTotal = effectivePrice * item.quantity;
                const maxStock = item.book.stock > 0 ? item.book.stock : 99;

                return (
                  <div
                    key={item.bookId}
                    className="pt-4 first:pt-0 flex gap-3.5 items-start group"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/book/${item.book.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="relative w-16 h-22 rounded-lg bg-muted/50 border border-border/80 overflow-hidden flex-shrink-0 shadow-2xs hover:opacity-90 transition-opacity"
                    >
                      <Image
                        src={item.book.coverImageUrl || "/placeholder-book.jpg"}
                        alt={item.book.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </Link>

                    {/* Info and Controls */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/book/${item.book.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors"
                            title={item.book.title}
                          >
                            {item.book.title}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.book.author.name}
                          </p>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.bookId)}
                          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label={`Remove ${item.book.title} from cart`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      {/* Price breakdown & Line total */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-foreground">
                          ৳{effectivePrice.toLocaleString()}
                        </span>
                        {originalPrice && (
                          <span className="text-[11px] text-muted-foreground line-through">
                            ৳{originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          × {item.quantity} ={" "}
                          <strong className="text-foreground font-semibold">
                            ৳{lineTotal.toLocaleString()}
                          </strong>
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 pt-1">
                        <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="size-6 text-muted-foreground hover:text-foreground rounded-none"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-bold text-foreground select-none">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className="size-6 text-muted-foreground hover:text-foreground rounded-none"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        {item.book.stock > 0 && item.book.stock <= 5 && (
                          <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 pl-1">
                            Only {item.book.stock} left in stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & CTAs */}
            <div className="p-4 sm:p-5 border-t border-border bg-card/50 space-y-3 mt-auto">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-foreground">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        FREE
                      </span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary text-lg">
                    ৳{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl font-semibold text-sm border-border hover:bg-muted"
                  >
                    View Full Cart
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* Empty Cart State in Drawer */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="size-16 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground shadow-inner">
              <ShoppingBag className="size-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1.5 max-w-xs">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Your cart is empty
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Discover popular bestsellers, fiction, academic books, and more to add to your library.
              </p>
            </div>
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Button className="rounded-xl px-5 font-semibold text-xs bg-primary text-primary-foreground">
                Browse Books
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
