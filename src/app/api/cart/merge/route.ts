import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const mergeItemSchema = z.object({
  bookId: z.string().min(1),
  quantity: z.number().int().min(1),
});

const mergeCartSchema = z.object({
  items: z.array(mergeItemSchema),
});

// POST /api/cart/merge: Merges guest localStorage items into authenticated user DB cart
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to merge cart items" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = mergeCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid merge payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const guestItems = parsed.data.items;

    // Process each guest item in a transaction
    if (guestItems.length > 0) {
      // Validate which books actually exist
      const bookIds = guestItems.map((item) => item.bookId);
      const validBooks = await prisma.book.findMany({
        where: { id: { in: bookIds } },
        select: { id: true, stock: true },
      });
      const validBookIdSet = new Set(validBooks.map((b) => b.id));

      await prisma.$transaction(async (tx) => {
        for (const guestItem of guestItems) {
          if (!validBookIdSet.has(guestItem.bookId)) {
            continue;
          }

          const existing = await tx.cartItem.findUnique({
            where: {
              userId_bookId: {
                userId: user.id,
                bookId: guestItem.bookId,
              },
            },
          });

          if (existing) {
            // Combine quantities
            await tx.cartItem.update({
              where: { id: existing.id },
              data: {
                quantity: existing.quantity + guestItem.quantity,
              },
            });
          } else {
            // Create new cart item
            await tx.cartItem.create({
              data: {
                userId: user.id,
                bookId: guestItem.bookId,
                quantity: guestItem.quantity,
              },
            });
          }
        }
      });
    }

    // Return the updated full cart
    const fullCart = await prisma.cartItem.findMany({
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

    return NextResponse.json({
      message: "Cart merged successfully",
      items: fullCart,
    });
  } catch (error) {
    console.error("Error merging cart items:", error);
    return NextResponse.json(
      { error: "Failed to merge cart items" },
      { status: 500 }
    );
  }
}
