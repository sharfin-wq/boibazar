"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Heart,
  ShoppingCart,
  Trash2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StockBadge } from "@/components/StockBadge";
import { useCart } from "@/context/CartContext";
import { useWishlist, WishlistItemData } from "@/context/WishlistContext";

interface WishlistViewProps {
  initialItems: WishlistItemData[];
}

export function WishlistView({ initialItems }: WishlistViewProps) {
  const { addItem } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [movingId, setMovingId] = React.useState<string | null>(null);

  // Use live items from context or fallback to initialItems
  const items = wishlistItems.length > 0 ? wishlistItems : initialItems;

  const handleMoveToCart = async (item: WishlistItemData) => {
    setMovingId(item.bookId);
    try {
      // 1. Add to cart
      addItem(
        {
          id: item.book.id,
          slug: item.book.slug,
          title: item.book.title,
          author: item.book.author.name,
          price: item.book.price,
          discountPrice: item.book.discountPrice,
          coverImage: item.book.coverImageUrl,
          stockCount: item.book.stock,
        },
        1
      );

      // 2. Remove from wishlist
      await removeFromWishlist(item.bookId);

      toast.success(`Moved "${item.book.title}" to your cart!`, {
        description: "The item was added to your cart and removed from your wishlist.",
      });
    } catch (err) {
      console.error("Error moving to cart:", err);
      toast.error("Failed to move item to cart");
    } finally {
      setMovingId(null);
    }
  };

  const handleRemove = async (item: WishlistItemData) => {
    await removeFromWishlist(item.bookId);
    toast.info(`Removed "${item.book.title}" from your wishlist.`);
  };

  if (items.length === 0) {
    return (
      <Card className="border border-dashed border-border text-center py-16 rounded-3xl bg-card">
        <CardContent className="space-y-4">
          <div className="mx-auto size-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 mb-2">
            <Heart className="size-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Your Wishlist is Empty</h3>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Explore our vast collection of books and click the heart icon on any book to save it here for later.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button className="rounded-xl px-6 bg-primary text-primary-foreground font-bold text-xs h-10 shadow-sm gap-2">
                <BookOpen className="size-4" />
                <span>Explore Catalog</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Saved Books ({items.length})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const hasDiscount =
            item.book.discountPrice !== null &&
            item.book.discountPrice !== undefined &&
            item.book.discountPrice < item.book.price;
          const sellingPrice = hasDiscount && item.book.discountPrice ? item.book.discountPrice : item.book.price;
          const originalPrice = hasDiscount ? item.book.price : undefined;
          const isOutOfStock = item.book.stock <= 0;

          return (
            <Card
              key={item.id}
              className="rounded-3xl border border-border/80 bg-card overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-4 sm:p-5 space-y-4">
                {/* Book Cover + Stock Badge */}
                <div className="relative w-full aspect-[3/4] bg-muted/40 rounded-2xl overflow-hidden flex items-center justify-center p-3">
                  <Link
                    href={`/book/${item.book.slug}`}
                    className="relative w-full h-full max-w-[85%] max-h-[92%] rounded-md overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300"
                  >
                    <Image
                      src={item.book.coverImageUrl || "/placeholder-book.jpg"}
                      alt={item.book.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  </Link>

                  {/* Remove Button on Cover */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    aria-label="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 z-20 size-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all shadow-sm"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  {/* Stock Badge */}
                  <div className="absolute bottom-2.5 left-2.5 z-20">
                    <StockBadge stockCount={item.book.stock} size="sm" />
                  </div>
                </div>

                {/* Book Info */}
                <div className="space-y-1">
                  <Link
                    href={`/book/${item.book.slug}`}
                    className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-1 block"
                  >
                    {item.book.title}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.book.author.name}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-foreground">
                      ৳{sellingPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 pt-0 border-t border-border/60 bg-muted/10 grid grid-cols-2 gap-2 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(item)}
                  className="rounded-xl text-xs font-semibold border-border hover:bg-muted text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  <span>Remove</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isOutOfStock || movingId === item.bookId}
                  onClick={() => handleMoveToCart(item)}
                  className="rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs gap-1"
                >
                  <ShoppingCart className="size-3.5" />
                  <span>{isOutOfStock ? "Out of Stock" : "Move to Cart"}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
