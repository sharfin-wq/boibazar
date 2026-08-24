import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return Response.json({ suggestions: [] });
    }

    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { author: { name: { contains: query } } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
        discountPrice: true,
        coverImageUrl: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    });

    return Response.json({ suggestions: books });
  } catch (error) {
    console.error("Search suggestions API error:", error);
    return Response.json({ suggestions: [], error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
