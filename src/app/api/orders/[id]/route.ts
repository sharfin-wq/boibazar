import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, props: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to view order details" },
        { status: 401 }
      );
    }

    const { id } = await props.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
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
                price: true,
                discountPrice: true,
                author: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch order detail" },
      { status: 500 }
    );
  }
}
