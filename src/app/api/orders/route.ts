import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const placeOrderSchema = z.object({
  addressId: z.string().min(1, "Delivery address is required"),
  paymentMethod: z.enum(["cod", "card"]).default("cod"),
  cardDetails: z
    .object({
      cardNumber: z.string().optional(),
      cardHolder: z.string().optional(),
      expiryDate: z.string().optional(),
      cvc: z.string().optional(),
    })
    .optional(),
});

// GET /api/orders: Fetch all orders for current user
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to view orders" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        address: true,
        items: {
          include: {
            book: {
              select: {
                id: true,
                slug: true,
                title: true,
                coverImageUrl: true,
                author: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders: Place an order from current user's cart
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to place an order" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = placeOrderSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid order payload";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { addressId, paymentMethod } = parsed.data;

    // 1. Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Invalid delivery address selected" },
        { status: 400 }
      );
    }

    // 2. Fetch user's cart items from DB
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
              select: { name: true },
            },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty. Please add books before checking out." },
        { status: 400 }
      );
    }

    // 3. Calculate subtotal, shipping, total
    const subtotal = cartItems.reduce((sum, item) => {
      const unitPrice =
        item.book.discountPrice !== null &&
        item.book.discountPrice !== undefined &&
        item.book.discountPrice < item.book.price
          ? item.book.discountPrice
          : item.book.price;
      return sum + unitPrice * item.quantity;
    }, 0);

    const shippingFee = subtotal >= 1000 ? 0 : 60;
    const total = subtotal + shippingFee;
    const orderStatus = paymentMethod === "card" ? "PAID" : "PENDING";

    // 4. Atomic Transaction: Create Order, OrderItems, Decrement Book Stock, Increment soldCount, Clear Cart
    const createdOrder = await prisma.$transaction(async (tx) => {
      // 4a. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          addressId: address.id,
          status: orderStatus,
          subtotal,
          shippingFee,
          total,
        },
      });

      // 4b. Create OrderItems & update book stocks
      for (const item of cartItems) {
        const unitPrice =
          item.book.discountPrice !== null &&
          item.book.discountPrice !== undefined &&
          item.book.discountPrice < item.book.price
            ? item.book.discountPrice
            : item.book.price;

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            bookId: item.bookId,
            quantity: item.quantity,
            priceAtPurchase: unitPrice,
          },
        });

        // Decrement stock (minimum 0) and increment soldCount
        const currentBook = await tx.book.findUnique({
          where: { id: item.bookId },
          select: { stock: true, soldCount: true },
        });

        if (currentBook) {
          await tx.book.update({
            where: { id: item.bookId },
            data: {
              stock: Math.max(0, currentBook.stock - item.quantity),
              soldCount: currentBook.soldCount + item.quantity,
            },
          });
        }
      }

      // 4c. Delete all CartItems for this user
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

      return newOrder;
    });

    // 5. Fetch the complete order with relations for the confirmation response
    const fullOrder = await prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: {
        address: true,
        items: {
          include: {
            book: {
              select: {
                id: true,
                slug: true,
                title: true,
                coverImageUrl: true,
                author: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        order: fullOrder,
        paymentMethod,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
