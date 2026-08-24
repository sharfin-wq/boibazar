"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface WishlistBook {
  id: string;
  slug: string;
  title: string;
  coverImageUrl: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  author: {
    name: string;
  };
}

export interface WishlistItemData {
  id: string;
  bookId: string;
  addedAt: string | Date;
  book: WishlistBook;
}

interface WishlistContextType {
  wishlistBookIds: Set<string>;
  wishlistItems: WishlistItemData[];
  isLoading: boolean;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (bookId: string, title?: string) => Promise<boolean>;
  removeFromWishlist: (bookId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [wishlistItems, setWishlistItems] = React.useState<WishlistItemData[]>([]);
  const [wishlistBookIds, setWishlistBookIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const isAuthenticated = status === "authenticated";

  const refreshWishlist = React.useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setWishlistBookIds(new Set());
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        const items: WishlistItemData[] = data.items || [];
        setWishlistItems(items);
        setWishlistBookIds(new Set(items.map((i) => i.bookId)));
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = React.useCallback(
    (bookId: string) => {
      return wishlistBookIds.has(bookId);
    },
    [wishlistBookIds]
  );

  const toggleWishlist = React.useCallback(
    async (bookId: string, title?: string): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.info("Please sign in to save books to your wishlist.", {
          action: {
            label: "Sign In",
            onClick: () => (window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`),
          },
        });
        return false;
      }

      const wasInWishlist = wishlistBookIds.has(bookId);

      // Optimistic update
      setWishlistBookIds((prev) => {
        const next = new Set(prev);
        if (wasInWishlist) {
          next.delete(bookId);
        } else {
          next.add(bookId);
        }
        return next;
      });

      if (wasInWishlist) {
        setWishlistItems((prev) => prev.filter((i) => i.bookId !== bookId));
        if (title) toast.info(`Removed "${title}" from your wishlist.`);
      }

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.inWishlist && data.item) {
            setWishlistItems((prev) => [data.item, ...prev]);
            toast.success(data.message || `Saved "${title || "Book"}" to your wishlist!`);
          }
          return data.inWishlist;
        } else {
          // Revert optimistic update
          refreshWishlist();
          return wasInWishlist;
        }
      } catch (err) {
        console.error("Failed to toggle wishlist:", err);
        refreshWishlist();
        return wasInWishlist;
      }
    },
    [isAuthenticated, wishlistBookIds, refreshWishlist]
  );

  const removeFromWishlist = React.useCallback(
    async (bookId: string) => {
      if (!isAuthenticated) return;

      // Optimistic removal
      setWishlistBookIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
      setWishlistItems((prev) => prev.filter((i) => i.bookId !== bookId));

      try {
        await fetch(`/api/wishlist?bookId=${encodeURIComponent(bookId)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Error removing from wishlist:", err);
        refreshWishlist();
      }
    },
    [isAuthenticated, refreshWishlist]
  );

  const value = React.useMemo(
    () => ({
      wishlistBookIds,
      wishlistItems,
      isLoading,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      refreshWishlist,
    }),
    [
      wishlistBookIds,
      wishlistItems,
      isLoading,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      refreshWishlist,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
