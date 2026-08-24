"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/context/CartContext";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemove: (bookId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
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

  const lineSubtotal = effectivePrice * item.quantity;
  const maxStock = item.book.stock > 0 ? item.book.stock : 99;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-2xs hover:border-primary/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left: Book Cover + Details */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Cover Thumbnail */}
        <Link
          href={`/book/${item.book.slug}`}
          className="relative w-16 h-22 sm:w-20 sm:h-28 rounded-xl bg-muted/50 border border-border overflow-hidden flex-shrink-0 shadow-xs hover:scale-105 transition-transform"
        >
          <Image
            src={item.book.coverImageUrl || "/placeholder-book.jpg"}
            alt={item.book.title}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        </Link>

        {/* Title, Author, Price */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <Link
            href={`/book/${item.book.slug}`}
            className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
          >
            {item.book.title}
          </Link>
          <p className="text-xs text-muted-foreground font-medium line-clamp-1">
            By <span className="text-foreground/80">{item.book.author.name}</span>
          </p>

          {/* Price breakdown */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-sm font-bold text-foreground">
              ৳{effectivePrice.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
            {originalPrice && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                Save ৳{(originalPrice - effectivePrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Alert */}
          {item.book.stock > 0 && item.book.stock <= 5 && (
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              ⚡ Only {item.book.stock} copies left in stock
            </p>
          )}
        </div>
      </div>

      {/* Right: Quantity Stepper, Line Subtotal & Remove Button */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-border rounded-xl bg-card shadow-2xs overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.bookId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="size-8 text-muted-foreground hover:text-foreground rounded-none"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-bold text-foreground select-none">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.bookId, item.quantity + 1)}
            disabled={item.quantity >= maxStock}
            className="size-8 text-muted-foreground hover:text-foreground rounded-none"
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>

        {/* Line Subtotal */}
        <div className="text-right min-w-[90px]">
          <span className="text-xs text-muted-foreground block">Subtotal</span>
          <span className="text-base font-extrabold text-foreground">
            ৳{lineSubtotal.toLocaleString()}
          </span>
        </div>

        {/* Remove Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(item.bookId)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl size-9 shrink-0"
          aria-label={`Remove ${item.book.title} from cart`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
