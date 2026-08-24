"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  User,
  Building2,
  Truck,
  RotateCcw,
  CreditCard,
  Tag,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/PriceTag";
import { RatingStars } from "@/components/RatingStars";
import { StockBadge } from "@/components/StockBadge";
import { BookGallery } from "@/components/book/BookGallery";

interface CategoryItem {
  id: string;
  slug: string;
  name: string;
}

export interface BookProductViewProps {
  book: {
    id: string;
    slug: string;
    title: string;
    banglaTitle?: string | null;
    isbn?: string | null;
    edition?: string | null;
    numberOfPages?: number | null;
    language: string;
    description: string;
    coverImageUrl?: string | null;
    price: number;
    discountPrice?: number | null;
    stock: number;
    isFeatured?: boolean;
    publishedYear?: number | null;
    author: {
      id: string;
      name: string;
      slug: string;
    };
    publisher: {
      id: string;
      name: string;
      slug: string;
    };
    categories: Array<{
      category: CategoryItem;
    }>;
    reviews: Array<{
      rating: number;
    }>;
  };
}

export function BookProductView({ book }: BookProductViewProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = React.useState<number>(1);

  const isWishlisted = isInWishlist(book.id);

  const reviewCount = book.reviews?.length || 0;
  const avgRating =
    reviewCount > 0
      ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const hasDiscount =
    book.discountPrice !== null &&
    book.discountPrice !== undefined &&
    book.discountPrice < book.price;

  const sellingPrice = hasDiscount && book.discountPrice ? book.discountPrice : book.price;
  const originalPrice = hasDiscount ? book.price : undefined;
  const savings = hasDiscount ? Math.round(book.price - (book.discountPrice || book.price)) : 0;
  const isOutOfStock = book.stock <= 0;
  const maxAvailable = Math.max(1, book.stock);

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => Math.min(maxAvailable, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Sorry, this book is currently out of stock.");
      return;
    }

    addItem(
      {
        id: book.id,
        slug: book.slug,
        title: book.title,
        coverImage: book.coverImageUrl || undefined,
        price: sellingPrice,
        originalPrice: originalPrice,
        discountPrice: book.discountPrice,
        stock: book.stock,
        author: book.author.name,
      },
      quantity
    );
  };

  const handleToggleWishlist = () => {
    toggleWishlist(book.id, book.title);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author.name} on BoiBazar!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* LEFT COLUMN: Cover Image Stage with Zoom */}
      <div className="md:col-span-5 lg:col-span-5 w-full">
        <BookGallery
          title={book.title}
          author={book.author.name}
          coverImageUrl={book.coverImageUrl}
          price={book.price}
          discountPrice={book.discountPrice}
          stock={book.stock}
          isFeatured={book.isFeatured}
        />
      </div>

      {/* RIGHT COLUMN: Book Metadata, Price, Stock, Quantity & Action Buttons */}
      <div className="md:col-span-7 lg:col-span-7 space-y-6">
        {/* Category tags & Share */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {book.categories.map(({ category }) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Tag className="size-3" />
                <span>{category.name}</span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Share this book"
            aria-label="Share this book"
          >
            <Share2 className="size-4" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {book.title}
          </h1>

          {/* Author & Publisher Row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground pt-1">
            {/* Linked Author */}
            <div className="flex items-center gap-1.5">
              <User className="size-4 text-primary" />
              <span>By</span>
              <Link
                href={`/author/${book.author.slug}`}
                className="font-bold text-foreground hover:text-primary hover:underline transition-colors"
              >
                {book.author.name}
              </Link>
            </div>

            <span className="text-border hidden sm:inline">•</span>

            {/* Linked Publisher */}
            <div className="flex items-center gap-1.5">
              <Building2 className="size-4 text-primary" />
              <span>Publisher:</span>
              <Link
                href={`/publisher/${book.publisher.slug}`}
                className="font-semibold text-foreground hover:text-primary hover:underline transition-colors"
              >
                {book.publisher.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Rating Summary Row */}
        <div className="flex items-center gap-3 pt-1">
          <RatingStars
            rating={avgRating}
            reviewsCount={reviewCount}
            showScore={true}
            size="default"
          />
          {reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">
              • Verified Customer Ratings
            </span>
          )}
        </div>

        <div className="h-px bg-border/80 w-full my-2" />

        {/* Price & Stock Section */}
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                Price
              </span>
              <div>
                <PriceTag
                  price={sellingPrice}
                  originalPrice={originalPrice}
                  size="lg"
                />
              </div>
            </div>

            <div className="self-center">
              <StockBadge stockCount={book.stock} size="default" lowStockThreshold={5} />
            </div>
          </div>

          {hasDiscount && savings > 0 && (
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              🎉 You save ৳{savings.toLocaleString()} on this order!
            </p>
          )}
        </div>

        {/* Quantity & CTA Actions */}
        <div className="space-y-4 pt-1">
          {/* Quantity Selector & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between sm:justify-start gap-1 p-1 rounded-xl bg-card border border-border shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleDecreaseQty}
                disabled={isOutOfStock || quantity <= 1}
                className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>

              <span className="w-10 text-center font-bold text-sm text-foreground select-none">
                {quantity}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleIncreaseQty}
                disabled={isOutOfStock || quantity >= maxAvailable}
                className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 h-11 px-6 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-98 gap-2"
            >
              <ShoppingCart className="size-4" />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </Button>

            {/* Add to Wishlist Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleWishlist}
              className="h-11 px-4 sm:px-5 rounded-xl font-semibold text-sm border-border hover:bg-muted transition-all gap-2"
              aria-label="Add to Wishlist"
            >
              <Heart
                className={`size-4 transition-colors ${
                  isWishlisted ? "text-rose-600 fill-rose-600" : "text-muted-foreground"
                }`}
              />
              <span className="hidden sm:inline">Wishlist</span>
            </Button>
          </div>
        </div>

        {/* Service Perks & Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-card border border-border/70 text-xs">
          <div className="flex items-center gap-2.5">
            <Truck className="size-4 text-primary shrink-0" />
            <div className="space-y-0.5">
              <p className="font-semibold text-foreground">Fast Delivery</p>
              <p className="text-muted-foreground text-[11px]">2-3 Days Islandwide</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CreditCard className="size-4 text-emerald-600 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-semibold text-foreground">Cash on Delivery</p>
              <p className="text-muted-foreground text-[11px]">Pay upon arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <RotateCcw className="size-4 text-amber-500 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-semibold text-foreground">7 Days Return</p>
              <p className="text-muted-foreground text-[11px]">Hassle-free guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
