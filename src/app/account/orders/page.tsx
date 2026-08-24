import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingBag,
  Calendar,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  Home,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders | BoiBazar",
  description: "View and track all your past and active book orders on BoiBazar.",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
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
    orderBy: { createdAt: "desc" },
  });

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
        <span className="text-foreground font-semibold">Orders</span>
      </nav>

      {/* Header */}
      <div className="pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Package className="h-7 w-7 text-primary" />
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review and track all your previous and active book orders
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-muted border border-border text-foreground self-start sm:self-auto">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"} Placed
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const shortId = order.id.slice(-8).toUpperCase();
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <Card
                key={order.id}
                className="rounded-3xl border border-border bg-card shadow-2xs overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="p-4 sm:p-5 bg-muted/20 border-b border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold font-mono text-foreground text-sm">
                      Order #{shortId}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {orderDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        order.status === "PAID"
                          ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                          : order.status === "DELIVERED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {order.status}
                    </span>

                    <Link href={`/account/orders/${order.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 rounded-xl text-xs font-semibold text-primary hover:text-primary/80 hover:bg-primary/10 gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-5 space-y-4">
                  {/* Items List */}
                  <div className="divide-y divide-border/60">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Link
                            href={`/book/${item.book.slug}`}
                            className="relative w-12 h-16 rounded-lg bg-muted/50 border border-border overflow-hidden flex-shrink-0 shadow-2xs"
                          >
                            <Image
                              src={item.book.coverImageUrl || "/placeholder-book.jpg"}
                              alt={item.book.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/book/${item.book.slug}`}
                              className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.book.title}
                            </Link>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.book.author.name}
                            </p>
                            <p className="text-xs text-muted-foreground pt-0.5">
                              ৳{item.priceAtPurchase.toLocaleString()} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right font-bold text-sm text-foreground flex-shrink-0">
                          ৳{(item.priceAtPurchase * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer summary */}
                  <div className="pt-3 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {order.address && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-sm">
                          Delivering to: <strong className="text-foreground">{order.address.recipientName}</strong>, {order.address.city}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <span className="text-muted-foreground">
                        Total ({totalQty} books):{" "}
                        <strong className="text-foreground text-sm font-extrabold">
                          ৳{order.total.toLocaleString()}
                        </strong>
                      </span>

                      <Link href={`/account/orders/${order.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-xl text-xs font-semibold border-border gap-1"
                        >
                          <span>View Order</span>
                          <ArrowUpRight className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border border-dashed border-border text-center py-16 rounded-3xl">
          <CardHeader className="space-y-2">
            <div className="mx-auto size-16 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground mb-2">
              <ShoppingBag className="size-8 stroke-[1.5]" />
            </div>
            <CardTitle className="text-xl font-bold">No Orders Yet</CardTitle>
            <CardDescription className="max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
              You haven&apos;t placed any orders yet. Browse our catalog and start adding books to your cart!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Link href="/">
              <Button className="rounded-xl px-6 bg-primary text-primary-foreground font-bold text-xs h-10 shadow-sm">
                Browse Books
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
