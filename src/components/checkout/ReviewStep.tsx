"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ClipboardCheck,
  MapPin,
  Truck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/context/CartContext";
import { Address } from "./AddressStep";

interface ReviewStepProps {
  cartItems: CartItem[];
  selectedAddress: Address;
  subtotal: number;
  shippingFee: number;
  total: number;
  onBack: () => void;
  onContinue: () => void;
  onChangeAddress: () => void;
}

export function ReviewStep({
  cartItems,
  selectedAddress,
  subtotal,
  shippingFee,
  total,
  onBack,
  onContinue,
  onChangeAddress,
}: ReviewStepProps) {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="pb-4 border-b border-border/80">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <ClipboardCheck className="size-5 sm:size-6 text-primary" />
          <span>Review Your Order</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Please verify your items, pricing, and delivery address before proceeding to payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Line Items + Delivery Address */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Address Card */}
          <Card className="rounded-3xl border-border bg-card shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Delivery Destination</h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onChangeAddress}
                className="text-xs font-semibold text-primary hover:text-primary/80 h-8 px-2.5"
              >
                Change Address
              </Button>
            </div>
            <CardContent className="p-4 sm:p-5 text-xs text-muted-foreground space-y-1">
              <p className="text-sm font-bold text-foreground">
                {selectedAddress.recipientName} ({selectedAddress.label})
              </p>
              <p className="text-foreground/90 font-medium">{selectedAddress.phone}</p>
              <p className="text-muted-foreground leading-relaxed pt-1">
                {selectedAddress.addressLine}, {selectedAddress.city} - {selectedAddress.postalCode}
              </p>
            </CardContent>
          </Card>

          {/* 2. Order Line Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Items in Order ({totalQuantity})
              </span>
              <Link
                href="/cart"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Edit Cart</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-border/60 rounded-3xl border border-border bg-card shadow-2xs overflow-hidden">
              {cartItems.map((item) => {
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

                return (
                  <div
                    key={item.bookId}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative w-14 h-18 sm:w-16 sm:h-22 rounded-xl bg-muted/40 border border-border overflow-hidden flex-shrink-0 shadow-2xs">
                        <Image
                          src={item.book.coverImageUrl || "/placeholder-book.jpg"}
                          alt={item.book.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-bold text-foreground line-clamp-1">
                          {item.book.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.book.author.name}
                        </p>
                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="text-xs font-bold text-foreground">
                            ৳{effectivePrice.toLocaleString()}
                          </span>
                          {originalPrice && (
                            <span className="text-[11px] text-muted-foreground line-through">
                              ৳{originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            × {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-extrabold text-foreground block">
                        ৳{lineTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Next Step */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
            <div className="p-5 pb-3 border-b border-border/60 bg-muted/20">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <ShoppingBag className="size-4 text-primary" />
                <span>Price Details</span>
              </h3>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-semibold text-foreground">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="size-3.5" />
                    Estimated Shipping
                  </span>
                  <span className="font-semibold text-foreground">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="size-3" /> FREE
                      </span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <span className="text-base font-bold text-foreground">
                    Grand Total
                  </span>
                  <span className="text-xl font-extrabold text-primary">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="button"
                  onClick={onContinue}
                  className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="size-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Address</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
