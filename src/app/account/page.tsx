import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileEditForm } from "@/components/account/ProfileEditForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
  Mail,
  Calendar,
  ChevronRight,
  Home,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Account | BoiBazar",
  description: "Manage your profile, view order history, saved addresses, and book wishlist on BoiBazar.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  const [ordersCount, wishlistCount, addressesCount, defaultAddress] =
    await Promise.all([
      prisma.order.count({ where: { userId: user.id } }),
      prisma.wishlistItem.count({ where: { userId: user.id } }),
      prisma.address.count({ where: { userId: user.id } }),
      prisma.address.findFirst({
        where: { userId: user.id, isDefault: true },
      }),
    ]);

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8">
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
        <span className="text-foreground font-semibold">My Account</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <User className="size-7 text-primary" />
            <span>Account Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your personal profile, track active orders, saved books, and delivery addresses.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="size-4" />
          <span>Verified Customer</span>
        </div>
      </div>

      {/* 3 Quick Link Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Orders Card */}
        <Link href="/account/orders" className="group">
          <Card className="rounded-3xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md h-full">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Package className="size-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted border border-border text-foreground">
                {ordersCount} {ordersCount === 1 ? "Order" : "Orders"}
              </span>
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              <span>My Orders</span>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Track delivery progress and review purchase receipts
            </p>
          </Card>
        </Link>

        {/* Wishlist Card */}
        <Link href="/account/wishlist" className="group">
          <Card className="rounded-3xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-rose-400/50 hover:shadow-md h-full">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="size-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center font-bold">
                <Heart className="size-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                {wishlistCount} {wishlistCount === 1 ? "Book" : "Books"}
              </span>
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex items-center justify-between">
              <span>My Wishlist</span>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-rose-500 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Books you saved to purchase or read later
            </p>
          </Card>
        </Link>

        {/* Addresses Card */}
        <Link href="/account/addresses" className="group">
          <Card className="rounded-3xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md h-full">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <MapPin className="size-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted border border-border text-foreground">
                {addressesCount} {addressesCount === 1 ? "Address" : "Addresses"}
              </span>
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              <span>Saved Addresses</span>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Manage shipping destinations for faster checkout
            </p>
          </Card>
        </Link>
      </div>

      {/* Profile Details & Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
            <CardHeader className="p-5 sm:p-6 border-b border-border/60 bg-muted/20">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="size-5 text-primary" />
                <span>Personal Profile</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Your name is displayed across your orders and reviews.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-4">
              {/* Full Name with Edit Capability */}
              <ProfileEditForm
                initialName={user.name || ""}
                email={user.email}
              />

              {/* Email Address (Read-only) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </div>
                  <div className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Primary
                </span>
              </div>

              {/* Member Since */}
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer Since
                  </div>
                  <div className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>{memberSince}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Default Delivery Destination Snippet */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Default Address</h3>
              </div>
              <Link
                href="/account/addresses"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Manage
              </Link>
            </div>

            <CardContent className="p-5 text-xs space-y-2">
              {defaultAddress ? (
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">
                      {defaultAddress.recipientName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {defaultAddress.label}
                    </span>
                  </div>
                  <p className="font-medium text-foreground/90">{defaultAddress.phone}</p>
                  <p className="pt-1 leading-relaxed">
                    {defaultAddress.addressLine}, {defaultAddress.city} - {defaultAddress.postalCode}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-muted-foreground">
                    No default address saved yet.
                  </p>
                  <Link href="/account/addresses">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs font-semibold border-border"
                    >
                      Add Delivery Address
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
