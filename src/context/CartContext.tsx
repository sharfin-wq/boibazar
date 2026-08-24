"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface CartBook {
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

export interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
  book: CartBook;
}

export interface AddItemInput {
  id: string;
  slug?: string;
  title: string;
  coverImageUrl?: string;
  coverImage?: string;
  price: number;
  discountPrice?: number | null;
  originalPrice?: number | null;
  stock?: number;
  stockCount?: number;
  author: string | { name: string };
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  openCart: () => void;
  closeCart: () => void;
  setIsOpen: (open: boolean) => void;
  addItem: (book: AddItemInput, quantity?: number) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  removeItem: (bookId: string) => void;
  clearCart: () => void;
  mergeGuestCart: () => Promise<void>;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "boibazar_cart_v1";
export const FREE_SHIPPING_THRESHOLD = 1000;
export const FLAT_SHIPPING_FEE = 60;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isHydrated, setIsHydrated] = React.useState<boolean>(false);

  const isAuthenticated = status === "authenticated";
  const prevAuthStatusRef = React.useRef(status);

  // Helper to normalize input book data into standard CartBook structure
  const normalizeBook = React.useCallback((input: AddItemInput): CartBook => {
    const authorName =
      typeof input.author === "string" ? input.author : input.author?.name || "Unknown Author";

    return {
      id: input.id,
      slug: input.slug || input.id,
      title: input.title,
      coverImageUrl: input.coverImageUrl || input.coverImage || "",
      price: input.originalPrice && input.originalPrice > input.price ? input.originalPrice : input.price,
      discountPrice:
        input.discountPrice !== undefined
          ? input.discountPrice
          : input.originalPrice && input.originalPrice > input.price
          ? input.price
          : null,
      stock: input.stock ?? input.stockCount ?? 10,
      author: {
        name: authorName,
      },
    };
  }, []);

  // Sync guest items with localStorage
  const saveGuestCart = React.useCallback((cartItems: CartItem[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
      }
    } catch (err) {
      console.error("Failed to save guest cart to localStorage:", err);
    }
  }, []);

  // Merge guest cart into DB cart
  const mergeGuestCart = React.useCallback(async () => {
    try {
      if (typeof window === "undefined") return;

      const localData = localStorage.getItem(GUEST_CART_KEY);
      if (!localData) return;

      const guestItems: CartItem[] = JSON.parse(localData);
      if (!Array.isArray(guestItems) || guestItems.length === 0) return;

      const payload = {
        items: guestItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/cart/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        localStorage.removeItem(GUEST_CART_KEY);
        toast.success("Guest cart merged with your account!", {
          description: "Your saved books have been synchronized.",
        });
      }
    } catch (err) {
      console.error("Failed to merge guest cart:", err);
    }
  }, []);

  // Initial cart hydration & Session change detection
  React.useEffect(() => {
    let isMounted = true;

    async function initializeCart() {
      setIsLoading(true);

      if (status === "loading") {
        return;
      }

      if (status === "authenticated") {
        // Check if there is a guest cart to merge
        const localData = typeof window !== "undefined" ? localStorage.getItem(GUEST_CART_KEY) : null;
        if (localData) {
          try {
            const guestItems: CartItem[] = JSON.parse(localData);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              await mergeGuestCart();
              if (isMounted) {
                setIsHydrated(true);
                setIsLoading(false);
              }
              return;
            }
          } catch {
            localStorage.removeItem(GUEST_CART_KEY);
          }
        }

        // Fetch DB cart directly
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setItems(data.items || []);
            }
          }
        } catch (err) {
          console.error("Error fetching user cart:", err);
        }
      } else {
        // Guest user: load from localStorage
        try {
          const localData = localStorage.getItem(GUEST_CART_KEY);
          if (localData) {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && isMounted) {
              setItems(parsed);
            }
          } else if (isMounted) {
            setItems([]);
          }
        } catch (err) {
          console.error("Error reading localStorage cart:", err);
        }
      }

      if (isMounted) {
        setIsHydrated(true);
        setIsLoading(false);
      }
    }

    // Detect transition from unauthenticated to authenticated
    if (prevAuthStatusRef.current !== status) {
      prevAuthStatusRef.current = status;
    }

    initializeCart();

    return () => {
      isMounted = false;
    };
  }, [status, mergeGuestCart]);

  // Open & Close drawer helpers
  const openCart = React.useCallback(() => setIsOpen(true), []);
  const closeCart = React.useCallback(() => setIsOpen(false), []);

  // Add Item to Cart
  const addItem = React.useCallback(
    (input: AddItemInput, quantity: number = 1) => {
      const normalizedBook = normalizeBook(input);
      const bookId = normalizedBook.id;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.bookId === bookId);
        let newItems: CartItem[];

        if (existingIndex > -1) {
          // Increment quantity
          newItems = prevItems.map((item, idx) => {
            if (idx === existingIndex) {
              const newQty = item.quantity + quantity;
              return {
                ...item,
                quantity: normalizedBook.stock > 0 ? Math.min(newQty, normalizedBook.stock) : newQty,
                book: normalizedBook,
              };
            }
            return item;
          });
        } else {
          // New item
          const newItem: CartItem = {
            id: `cart-${bookId}-${Date.now()}`,
            bookId,
            quantity: normalizedBook.stock > 0 ? Math.min(quantity, normalizedBook.stock) : quantity,
            book: normalizedBook,
          };
          newItems = [newItem, ...prevItems];
        }

        if (!isAuthenticated) {
          saveGuestCart(newItems);
        }

        return newItems;
      });

      // Show toast
      toast.success(`Added "${normalizedBook.title}" to your cart!`, {
        description: quantity > 1 ? `${quantity} copies added.` : "Your cart has been updated.",
        action: {
          label: "View Cart",
          onClick: () => setIsOpen(true),
        },
      });

      // Background DB sync if authenticated
      if (isAuthenticated) {
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId, quantity }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.item) {
              // Update with official DB cart item
              setItems((current) =>
                current.map((item) =>
                  item.bookId === bookId ? { ...item, id: data.item.id } : item
                )
              );
            }
          })
          .catch((err) => {
            console.error("Failed to sync cart item with database:", err);
          });
      }
    },
    [isAuthenticated, normalizeBook, saveGuestCart]
  );

  // Remove Item (Optimistic)
  const removeItem = React.useCallback(
    (bookId: string) => {
      let removedTitle = "";

      setItems((prevItems) => {
        const itemToRemove = prevItems.find((i) => i.bookId === bookId);
        if (itemToRemove) {
          removedTitle = itemToRemove.book.title;
        }

        const newItems = prevItems.filter((item) => item.bookId !== bookId);

        if (!isAuthenticated) {
          saveGuestCart(newItems);
        }

        return newItems;
      });

      if (removedTitle) {
        toast.info(`Removed "${removedTitle}" from your cart.`);
      }

      // Background DB sync
      if (isAuthenticated) {
        fetch(`/api/cart?bookId=${encodeURIComponent(bookId)}`, {
          method: "DELETE",
        }).catch((err) => {
          console.error("Failed to remove item from DB:", err);
        });
      }
    },
    [isAuthenticated, saveGuestCart]
  );

  // Update Quantity (Optimistic)
  const updateQuantity = React.useCallback(
    (bookId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(bookId);
        return;
      }

      setItems((prevItems) => {
        const newItems = prevItems.map((item) => {
          if (item.bookId === bookId) {
            const maxStock = item.book.stock > 0 ? item.book.stock : 999;
            return {
              ...item,
              quantity: Math.min(quantity, maxStock),
            };
          }
          return item;
        });

        if (!isAuthenticated) {
          saveGuestCart(newItems);
        }

        return newItems;
      });

      // Background DB sync
      if (isAuthenticated) {
        fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId, quantity }),
        }).catch((err) => {
          console.error("Failed to update item quantity in DB:", err);
        });
      }
    },
    [isAuthenticated, saveGuestCart, removeItem]
  );

  // Clear Cart
  const clearCart = React.useCallback(() => {
    setItems([]);

    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(GUEST_CART_KEY);
      }
    } else {
      fetch("/api/cart?clear=true", {
        method: "DELETE",
      }).catch((err) => {
        console.error("Failed to clear DB cart:", err);
      });
    }
  }, [isAuthenticated]);

  // Derived Totals
  const totalItems = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = React.useMemo(() => {
    return items.reduce((sum, item) => {
      const price =
        item.book.discountPrice !== null &&
        item.book.discountPrice !== undefined &&
        item.book.discountPrice < item.book.price
          ? item.book.discountPrice
          : item.book.price;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const shippingFee = React.useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  }, [items.length, subtotal]);

  const totalPrice = React.useMemo(() => {
    return subtotal + shippingFee;
  }, [subtotal, shippingFee]);

  const value = React.useMemo(
    () => ({
      items,
      isOpen,
      isLoading,
      isHydrated,
      totalItems,
      subtotal,
      shippingFee,
      totalPrice,
      openCart,
      closeCart,
      setIsOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      mergeGuestCart,
    }),
    [
      items,
      isOpen,
      isLoading,
      isHydrated,
      totalItems,
      subtotal,
      shippingFee,
      totalPrice,
      openCart,
      closeCart,
      setIsOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      mergeGuestCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
