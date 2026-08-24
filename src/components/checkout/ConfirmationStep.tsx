"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlacedOrder } from "./PaymentStep";

interface ConfirmationStepProps {
  order: PlacedOrder;
}

export function ConfirmationStep({ order }: ConfirmationStepProps) {
  const shortId = order.id.slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-2">
      {/* 1. Celebration Hero Banner */}
      <div className="text-center space-y-3 p-6 sm:p-8 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
        <div className="mx-auto size-16 sm:size-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <CheckCircle2 className="size-9 sm:size-11 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Order Placed Successfully!
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Thank you for your purchase with BoiBazar. We have received your order and started preparing it for delivery.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold font-mono">
            <PackageCheck className="size-3.5" />
            Order #{shortId}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              order.status === "PAID"
                ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200"
                : "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200"
            }`}
          >
            {order.status === "PAID" ? (
              <>
                <CreditCard className="size-3.5" /> Paid (Demo Card)
              </>
            ) : (
              <>
                <Banknote className="size-3.5" /> Pending (Cash on Delivery)
              </>
            )}
          </span>
        </div>
      </div>

      {/* 2. Estimated Delivery & Key Notes */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary flex-shrink-0">
            <Truck className="size-5 sm:size-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Estimated Delivery
            </p>
            <p className="text-sm font-bold text-foreground">
              2 to 3 Business Days across Bangladesh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border">
          <Calendar className="size-3.5 text-primary" />
          <span>Placed on {orderDate}</span>
        </div>
      </div>

      {/* 3. Delivery Address & Receipt Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Address */}
        <Card className="rounded-3xl border-border bg-card shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Delivery Information</h3>
          </div>
          <CardContent className="p-4 sm:p-5 text-xs text-muted-foreground space-y-1">
            {order.address ? (
              <>
                <p className="text-sm font-bold text-foreground">
                  {order.address.recipientName} ({order.address.label})
                </p>
                <p className="text-foreground/90 font-medium">{order.address.phone}</p>
                <p className="leading-relaxed pt-1">
                  {order.address.addressLine}, {order.address.city} - {order.address.postalCode}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Standard Delivery</p>
            )}
          </CardContent>
        </Card>

        {/* Payment & Total */}
        <Card className="rounded-3xl border-border bg-card shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
            <ShoppingBag className="size-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Payment Summary</h3>
          </div>
          <CardContent className="p-4 sm:p-5 text-xs space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({totalQuantity} items)</span>
              <span className="font-semibold text-foreground">
                ৳{order.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="font-semibold text-foreground">
                {order.shippingFee === 0 ? "FREE" : `৳${order.shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-baseline">
              <span className="text-sm font-bold text-foreground">Total Paid/Due</span>
              <span className="text-lg font-black text-primary">
                ৳{order.total.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Ordered Line Items */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
          Ordered Books ({totalQuantity})
        </h3>

        <div className="divide-y divide-border/60 rounded-3xl border border-border bg-card shadow-2xs overflow-hidden">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="relative w-12 h-16 sm:w-14 sm:h-20 rounded-lg bg-muted/40 border border-border overflow-hidden flex-shrink-0 shadow-2xs">
                  <Image
                    src={item.book.coverImageUrl || "/placeholder-book.jpg"}
                    alt={item.book.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-foreground line-clamp-1">
                    {item.book.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.book.author.name}
                  </p>
                  <p className="text-xs text-muted-foreground pt-0.5">
                    ৳{item.priceAtPurchase.toLocaleString()} × {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 font-bold text-sm text-foreground">
                ৳{(item.priceAtPurchase * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Navigation Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border/80">
        <Link href="/account/orders" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-11 px-8 rounded-xl font-bold text-sm border-border hover:bg-muted"
          >
            View My Orders
          </Button>
        </Link>

        <Link href="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md gap-2">
            <span>Continue Shopping</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
