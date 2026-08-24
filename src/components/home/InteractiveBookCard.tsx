"use client";

import * as React from "react";
import { BookCard, BookCardProps } from "@/components/BookCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface InteractiveBookCardProps extends Omit<BookCardProps, "onAddToCart" | "onAddToWishlist"> {
  customOnAddToCart?: (title: string) => void;
  customOnAddToWishlist?: (title: string) => void;
}

export function InteractiveBookCard(props: InteractiveBookCardProps) {
  const { title, customOnAddToCart, customOnAddToWishlist, ...rest } = props;
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const bookId = rest.id ? String(rest.id) : title;
  const isWishlisted = isInWishlist(bookId);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (customOnAddToCart) {
      customOnAddToCart(title);
    } else {
      const slug = rest.href ? rest.href.replace(/^\/book\//, "") : bookId;

      addItem(
        {
          id: bookId,
          slug,
          title,
          author: rest.author,
          price: rest.price,
          originalPrice: rest.originalPrice,
          discountPrice: rest.originalPrice && rest.originalPrice > rest.price ? rest.price : undefined,
          coverImage: rest.coverImage,
          stockCount: rest.stockCount,
        },
        1
      );
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (customOnAddToWishlist) {
      customOnAddToWishlist(title);
    } else {
      toggleWishlist(bookId, title);
    }
  };

  return (
    <BookCard
      title={title}
      onAddToCart={handleAddToCart}
      onAddToWishlist={handleAddToWishlist}
      isWishlisted={isWishlisted}
      {...rest}
    />
  );
}
