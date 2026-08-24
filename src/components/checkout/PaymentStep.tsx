"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Address } from "./AddressStep";

export interface PlacedOrder {
  id: string;
  userId: string;
  addressId: string | null;
  status: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string | Date;
  address: Address | null;
  items: Array<{
    id: string;
    bookId: string;
    quantity: number;
    priceAtPurchase: number;
    book: {
      id: string;
      slug: string;
      title: string;
      coverImageUrl: string;
      author: {
        name: string;
      };
    };
  }>;
}

interface PaymentStepProps {
  selectedAddress: Address;
  subtotal: number;
  shippingFee: number;
  total: number;
  totalItems: number;
  onBack: () => void;
  onOrderPlaced: (order: PlacedOrder) => void;
}

export function PaymentStep({
  selectedAddress,
  subtotal,
  shippingFee,
  total,
  totalItems,
  onBack,
  onOrderPlaced,
}: PaymentStepProps) {
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = React.useState<"cod" | "card">("cod");
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);

  // Demo Card Form State
  const [cardNumber, setCardNumber] = React.useState("4242 •••• •••• 4242");
  const [cardHolder, setCardHolder] = React.useState(selectedAddress.recipientName || "Tanvir Ahmed");
  const [expiry, setExpiry] = React.useState("12/28");
  const [cvc, setCvc] = React.useState("888");

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const payload = {
        addressId: selectedAddress.id,
        paymentMethod,
        cardDetails:
          paymentMethod === "card"
            ? { cardNumber, cardHolder, expiryDate: expiry, cvc }
            : undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Clear the local cart state
      clearCart();

      toast.success("Order placed successfully!", {
        description: `Order #${data.order.id.slice(-8).toUpperCase()} has been confirmed.`,
      });

      onOrderPlaced(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      toast.error(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="pb-4 border-b border-border/80">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <CreditCard className="size-5 sm:size-6 text-primary" />
          <span>Select Payment Method</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Choose Cash on Delivery or Card Payment (Demo Sandbox).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Payment Method Options */}
        <div className="lg:col-span-8 space-y-4">
          {/* 1. Cash on Delivery Option */}
          <Card
            onClick={() => setPaymentMethod("cod")}
            className={`cursor-pointer rounded-3xl transition-all duration-200 border overflow-hidden ${
              paymentMethod === "cod"
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 bg-card"
            }`}
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                <Banknote className="size-6" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-foreground">
                    Cash on Delivery (COD)
                  </span>
                  <div
                    className={`size-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {paymentMethod === "cod" && <div className="size-2 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pay with physical cash upon receiving your book parcel at your doorstep anywhere in Bangladesh.
                </p>
                <div className="pt-1.5 flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="size-3.5" />
                  <span>Inspect package upon delivery before payment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Demo Card Payment Option */}
          <Card
            onClick={() => setPaymentMethod("card")}
            className={`cursor-pointer rounded-3xl transition-all duration-200 border overflow-hidden ${
              paymentMethod === "card"
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 bg-card"
            }`}
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5">
                <CreditCard className="size-6" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground">
                      Card Payment
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Demo Sandbox
                    </span>
                  </div>

                  <div
                    className={`size-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {paymentMethod === "card" && <div className="size-2 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Simulate an instant card transaction using test credentials. Order status will be marked as <strong>PAID</strong>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* If Card Payment Selected -> Show Demo Card Form */}
          {paymentMethod === "card" && (
            <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 animate-in fade-in-50 duration-300">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  <strong>Demo Mode:</strong> Pre-filled with sample details. No real bank account will be charged.
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-xs font-semibold">
                    Card Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="font-mono text-sm pl-10"
                    />
                    <CreditCard className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardHolder" className="text-xs font-semibold">
                      Cardholder Name
                    </Label>
                    <Input
                      id="cardHolder"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-xs font-semibold">
                        Expires
                      </Label>
                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="text-center font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cvc" className="text-xs font-semibold">
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="•••"
                        className="text-center font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Final Order Summary & Place Order Button */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
            <div className="p-5 pb-3 border-b border-border/60 bg-muted/20">
              <h3 className="font-bold text-base text-foreground flex items-center justify-between">
                <span>Payment Summary</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {totalItems} books
                </span>
              </h3>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
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

                <div className="flex justify-between text-muted-foreground">
                  <span>Selected Payment</span>
                  <span className="font-bold text-foreground capitalize">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Demo Card (PAID)"}
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <span className="text-base font-bold text-foreground">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-primary">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm sm:text-base shadow-md gap-2 transition-all active:scale-98"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      <span>Place Order • ৳{total.toLocaleString()}</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  disabled={isPlacingOrder}
                  className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Review</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-card border border-border/70 text-xs text-muted-foreground flex items-start gap-2.5">
            <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Safe & secure 256-bit encrypted checkout. You can review and track your order in your BoiBazar account anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
