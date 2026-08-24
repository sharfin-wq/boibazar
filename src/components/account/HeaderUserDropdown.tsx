"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWishlist } from "@/context/WishlistContext";

interface HeaderUserDropdownProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export function HeaderUserDropdown({ user }: HeaderUserDropdownProps) {
  const router = useRouter();
  const { wishlistBookIds } = useWishlist();
  const displayName = user.name || user.email.split("@")[0];
  const initial = (user.name ? user.name[0] : user.email[0]).toUpperCase();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-muted/60 hover:bg-muted border border-border text-xs font-semibold text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
        <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
          {initial}
        </div>
        <span className="max-w-[110px] truncate">{displayName}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-2xl p-1.5 shadow-lg border-border bg-card"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-bold text-foreground truncate">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 bg-border/80" />

        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            onClick={() => router.push("/account")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <UserIcon className="size-4 text-primary" />
            <span>My Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/account/orders")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <Package className="size-4 text-primary" />
            <span>My Orders</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/account/wishlist")}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="size-4 text-rose-500" />
              <span>My Wishlist</span>
            </div>
            {wishlistBookIds.size > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                {wishlistBookIds.size}
              </span>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/account/addresses")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <MapPin className="size-4 text-primary" />
            <span>Saved Addresses</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-border/80" />

        <DropdownMenuItem
          onClick={handleSignOut}
          variant="destructive"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 cursor-pointer"
        >
          <LogOut className="size-4 text-destructive" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
