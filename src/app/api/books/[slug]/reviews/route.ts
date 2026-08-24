import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
});

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, props: RouteParams) {
  try {
    const { slug } = await props.params;

    const book = await prisma.book.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { bookId: book.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, props: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to write a review." },
        { status: 401 }
      );
    }

    const { slug } = await props.params;

    const book = await prisma.book.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid review data.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { rating, comment } = parsed.data;

    const newReview = await prisma.review.create({
      data: {
        bookId: book.id,
        userId: user.id,
        rating,
        comment: comment ? comment.trim() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Review submitted successfully!",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting your review. Please try again." },
      { status: 500 }
    );
  }
}
