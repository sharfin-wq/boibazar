import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const addToCartSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

const updateCartSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
});

// 1. GET /api/cart: Fetch all cart items for authenticated user
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        book: {
          select: {
            id: true,
            slug: true,
            title: true,
            coverImageUrl: true,
            price: true,
            discountPrice: true,
            stock: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// 2. POST /api/cart: Add or increment an item in the cart
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to sync cart to database" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid cart data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { bookId, quantity } = parsed.data;

    // Verify book exists and check stock
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, stock: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Upsert or increment cart item
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: book.id,
        },
      },
    });

    let updatedCartItem;
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      updatedCartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
        include: {
          book: {
            select: {
              id: true,
              slug: true,
              title: true,
              coverImageUrl: true,
              price: true,
              discountPrice: true,
              stock: true,
              author: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    } else {
      updatedCartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          bookId: book.id,
          quantity,
        },
        include: {
          book: {
            select: {
              id: true,
              slug: true,
              title: true,
              coverImageUrl: true,
              price: true,
              discountPrice: true,
              stock: true,
              author: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ item: updatedCartItem }, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// 3. PATCH /api/cart: Update quantity of a cart item
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to modify cart" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = updateCartSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid update data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { bookId, quantity } = parsed.data;

    // If quantity is 0 or less, delete the item
    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          userId: user.id,
          bookId: bookId,
        },
      });
      return NextResponse.json({ deleted: true, bookId });
    }

    const updated = await prisma.cartItem.upsert({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: bookId,
        },
      },
      update: {
        quantity: quantity,
      },
      create: {
        userId: user.id,
        bookId: bookId,
        quantity: quantity,
      },
      include: {
        book: {
          select: {
            id: true,
            slug: true,
            title: true,
            coverImageUrl: true,
            price: true,
            discountPrice: true,
            stock: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// 4. DELETE /api/cart: Remove item or clear cart
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to remove from cart" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const clearAll = searchParams.get("clear") === "true";

    if (clearAll) {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id },
      });
      return NextResponse.json({ message: "Cart cleared successfully" });
    }

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required to remove an item" },
        { status: 400 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: user.id,
        bookId: bookId,
      },
    });

    return NextResponse.json({ message: "Item removed from cart", bookId });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
