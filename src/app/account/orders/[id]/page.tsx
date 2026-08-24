import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  ShoppingBag,
  Home,
  ChevronRight,
} from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  props: OrderDetailPageProps
): Promise<Metadata> {
  const { id } = await props.params;
  const shortId = id.slice(-8).toUpperCase();
  return {
    title: `Order #${shortId} | BoiBazar`,
    description: `Details and delivery status for order #${shortId} on BoiBazar.`,
  };
}

export default async function OrderDetailPage(props: OrderDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const { id } = await props.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      address: true,
      items: {
        include: {
          book: {
            select: {
              id: true,
              slug: true,
              title: true,
              coverImageUrl: true,
              author: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const shortId = order.id.slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6">
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
        <Link
          href="/account/orders"
          className="hover:text-primary transition-colors font-medium"
        >
          Orders
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
        <span className="text-foreground font-semibold">Order #{shortId}</span>
      </nav>

      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/account/orders">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Back to All Orders</span>
          </Button>
        </Link>
      </div>

      {/* Order Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-foreground">
              Order #{shortId}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                order.status === "PAID"
                  ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                  : order.status === "DELIVERED"
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                  : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
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

          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 pt-0.5">
            <Calendar className="size-3.5 text-primary" />
            <span>Placed on {orderDate}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
          <Truck className="size-4" />
          <span>Estimated 2–3 Days Delivery</span>
        </div>
      </div>

      {/* Delivery Destination & Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Address */}
        <Card className="rounded-3xl border-border bg-card shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Delivery Destination</h3>
          </div>
          <CardContent className="p-4 sm:p-5 text-xs text-muted-foreground space-y-1.5">
            {order.address ? (
              <>
                <p className="text-sm font-bold text-foreground">
                  {order.address.recipientName} ({order.address.label})
                </p>
                <p className="font-semibold text-foreground/90">{order.address.phone}</p>
                <p className="leading-relaxed pt-1 text-muted-foreground">
                  {order.address.addressLine}, {order.address.city} - {order.address.postalCode}
                </p>
              </>
            ) : (
              <p>Standard delivery address</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="rounded-3xl border-border bg-card shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center gap-2">
            <ShoppingBag className="size-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Payment Summary</h3>
          </div>
          <CardContent className="p-4 sm:p-5 text-xs space-y-2.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal ({totalQuantity} books)</span>
              <span className="font-semibold text-foreground">
                ৳{order.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Fee</span>
              <span className="font-semibold text-foreground">
                {order.shippingFee === 0 ? "FREE" : `৳${order.shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-baseline">
              <span className="text-sm font-bold text-foreground">Total Paid / Due</span>
              <span className="text-xl font-black text-primary">
                ৳{order.total.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Itemized Order Line Items */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
          Items in this Order ({totalQuantity})
        </h3>

        <div className="divide-y divide-border/60 rounded-3xl border border-border bg-card shadow-2xs overflow-hidden">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <Link
                  href={`/book/${item.book.slug}`}
                  className="relative w-14 h-20 sm:w-16 sm:h-22 rounded-xl bg-muted/40 border border-border overflow-hidden flex-shrink-0 shadow-2xs group"
                >
                  <Image
                    src={item.book.coverImageUrl || "/placeholder-book.jpg"}
                    alt={item.book.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/book/${item.book.slug}`}
                    className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.book.title}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.book.author.name}
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 text-xs text-muted-foreground">
                    <span>৳{item.priceAtPurchase.toLocaleString()} each</span>
                    <span>•</span>
                    <span className="font-semibold text-foreground">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 font-extrabold text-sm sm:text-base text-foreground">
                ৳{(item.priceAtPurchase * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-border">
        <Link href="/account/orders" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-11 px-8 rounded-xl font-bold text-xs border-border hover:bg-muted"
          >
            Back to All Orders
          </Button>
        </Link>
        <Link href="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md">
            Browse More Books
          </Button>
        </Link>
      </div>
    </div>
  );
}
