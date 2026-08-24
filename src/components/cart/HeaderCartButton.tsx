"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function HeaderCartButton() {
  const { totalItems, subtotal, openCart, isHydrated } = useCart();
  const [badgeBump, setBadgeBump] = React.useState(false);

  // Trigger subtle bump animation whenever totalItems increases
  const prevCount = React.useRef(totalItems);
  React.useEffect(() => {
    if (totalItems !== prevCount.current) {
      setBadgeBump(true);
      const timer = setTimeout(() => setBadgeBump(false), 300);
      prevCount.current = totalItems;
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const displayCount = isHydrated ? totalItems : 0;
  const displaySubtotal = isHydrated ? subtotal : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className="flex items-center gap-2 p-2 rounded-full sm:rounded-xl text-foreground hover:bg-muted transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
      aria-label={`Shopping cart with ${displayCount} items`}
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
        <span
          className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-xs transition-transform duration-200 ${
            badgeBump ? "scale-125 bg-emerald-600" : "scale-100"
          }`}
        >
          {displayCount}
        </span>
      </div>
      <div className="hidden lg:flex flex-col text-left">
        <span className="text-[10px] text-muted-foreground leading-none">Cart</span>
        <span className="text-xs font-bold text-foreground leading-tight">
          ৳{displaySubtotal.toLocaleString()}
        </span>
      </div>
    </button>
  );
}
