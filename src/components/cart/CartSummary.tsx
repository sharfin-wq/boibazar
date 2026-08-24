"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FREE_SHIPPING_THRESHOLD } from "@/context/CartContext";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  totalItems: number;
}

export function CartSummary({
  subtotal,
  shippingFee,
  totalPrice,
  totalItems,
}: CartSummaryProps) {
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60 bg-muted/20">
          <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-5">
          {/* Free Shipping Meter */}
          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Truck className="size-4 text-primary" />
                {freeShippingRemaining > 0 ? (
                  <>
                    Add <strong>৳{freeShippingRemaining.toLocaleString()}</strong> for FREE delivery
                  </>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="size-4 text-emerald-500" />
                    You unlocked FREE delivery!
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-primary">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cost Line Items */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal</span>
              <span className="font-semibold text-foreground">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Estimated Shipping</span>
                <span className="text-[10px] text-muted-foreground">
                  (Standard)
                </span>
              </div>
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

            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <div>
                <span className="text-base font-bold text-foreground block">
                  Total Payable
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Includes all applicable taxes
                </span>
              </div>
              <span className="text-2xl font-black text-primary">
                ৳{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-2.5 pt-2">
            <Link href="/checkout" className="block">
              <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-md transition-all active:scale-98 gap-2">
                <Lock className="size-4" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Trust & Guarantee Box */}
      <div className="p-4 rounded-2xl bg-card border border-border/70 text-xs space-y-3">
        <div className="flex items-center gap-2.5 text-foreground font-semibold">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>BoiBazar Buyer Protection</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary" />
            <span>100% Genuine Books</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="size-3 text-amber-500" />
            <span>7-Day Return Policy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="size-3 text-indigo-500" />
            <span>Nationwide Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="size-3 text-emerald-500" />
            <span>Secure Cash on Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
