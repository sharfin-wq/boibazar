import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const wishlistActionSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
});

// GET /api/wishlist: Fetch user's wishlisted books
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.wishlistItem.findMany({
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
              select: { name: true },
            },
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST /api/wishlist: Toggle or add item to wishlist
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to manage your wishlist" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = wishlistActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const { bookId } = parsed.data;

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, title: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: book.id,
        },
      },
    });

    if (existing) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        inWishlist: false,
        message: `Removed "${book.title}" from your wishlist.`,
        bookId: book.id,
      });
    } else {
      // Add to wishlist
      const newItem = await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          bookId: book.id,
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
                select: { name: true },
              },
            },
          },
        },
      });

      return NextResponse.json({
        inWishlist: true,
        message: `Saved "${book.title}" to your wishlist!`,
        item: newItem,
        bookId: book.id,
      });
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist: Remove book from wishlist
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to modify wishlist" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    let bookId = searchParams.get("bookId");

    if (!bookId) {
      try {
        const body = await request.json();
        bookId = body.bookId;
      } catch {
        // query param was empty
      }
    }

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        bookId: bookId,
      },
    });

    return NextResponse.json({
      message: "Removed from wishlist",
      bookId,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
