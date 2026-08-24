import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { FilterFacets } from "@/components/listing/FilterSidebar";

export interface FilterParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  discount?: string;
  inStock?: string;
  language?: string;
  author?: string;
  publisher?: string;
  sort?: string;
  page?: string;
}

export async function fetchFilteredBooks({
  categorySlug,
  authorSlug,
  publisherSlug,
  searchQuery,
  params,
  pageSize = 24,
}: {
  categorySlug?: string;
  authorSlug?: string;
  publisherSlug?: string;
  searchQuery?: string;
  params?: Record<string, string | string[] | undefined> | null;
  pageSize?: number;
}) {
  const p = params || {};
  const q = typeof p.q === "string" ? p.q.trim() : searchQuery || "";
  const minPrice = typeof p.minPrice === "string" ? parseFloat(p.minPrice) : NaN;
  const maxPrice = typeof p.maxPrice === "string" ? parseFloat(p.maxPrice) : NaN;
  const isDiscount = p.discount === "true";
  const isInStock = p.inStock === "true";
  const languages =
    typeof p.language === "string"
      ? p.language.split(",").filter(Boolean)
      : [];
  const authors =
    typeof p.author === "string"
      ? p.author.split(",").filter(Boolean)
      : [];
  const publishers =
    typeof p.publisher === "string"
      ? p.publisher.split(",").filter(Boolean)
      : [];
  const sort = typeof p.sort === "string" ? p.sort : "featured";
  const page = Math.max(1, parseInt(typeof p.page === "string" ? p.page : "1", 10) || 1);

  // Build where clause
  const whereConditions: Prisma.BookWhereInput[] = [];

  // Scoped by category
  if (categorySlug) {
    whereConditions.push({
      categories: {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      },
    });
  }

  // Scoped by author
  if (authorSlug) {
    whereConditions.push({
      author: {
        slug: authorSlug,
      },
    });
  }

  // Scoped by publisher
  if (publisherSlug) {
    whereConditions.push({
      publisher: {
        slug: publisherSlug,
      },
    });
  }

  // Scoped by search query
  if (q) {
    whereConditions.push({
      OR: [
        { title: { contains: q } },
        { author: { name: { contains: q } } },
        { publisher: { name: { contains: q } } },
        { description: { contains: q } },
        { isbn: { contains: q } },
      ],
    });
  }

  // Price range filters
  if (!isNaN(minPrice)) {
    whereConditions.push({
      price: {
        gte: minPrice,
      },
    });
  }
  if (!isNaN(maxPrice)) {
    whereConditions.push({
      price: {
        lte: maxPrice,
      },
    });
  }

  // Discount filter
  if (isDiscount) {
    whereConditions.push({
      discountPrice: {
        not: null,
        gt: 0,
      },
    });
  }

  // In Stock filter
  if (isInStock) {
    whereConditions.push({
      stock: {
        gt: 0,
      },
    });
  }

  // Language filter
  if (languages.length > 0) {
    whereConditions.push({
      language: {
        in: languages,
      },
    });
  }

  // Multi-author filter
  if (authors.length > 0) {
    whereConditions.push({
      author: {
        slug: {
          in: authors,
        },
      },
    });
  }

  // Multi-publisher filter
  if (publishers.length > 0) {
    whereConditions.push({
      publisher: {
        slug: {
          in: publishers,
        },
      },
    });
  }

  const where: Prisma.BookWhereInput =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Build OrderBy
  let orderBy: Prisma.BookOrderByWithRelationInput[] = [{ isFeatured: "desc" }, { soldCount: "desc" }];
  if (sort === "price_asc") {
    orderBy = [{ price: "asc" }];
  } else if (sort === "price_desc") {
    orderBy = [{ price: "desc" }];
  } else if (sort === "newest") {
    orderBy = [{ createdAt: "desc" }];
  } else if (sort === "bestselling") {
    orderBy = [{ soldCount: "desc" }];
  }

  // Execute queries in parallel
  const [books, totalCount, allAuthors, allPublishers, allLanguages, priceAggregate] =
    await Promise.all([
      // Paginated books
      prisma.book.findMany({
        where,
        include: {
          author: { select: { name: true, slug: true } },
          publisher: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),

      // Total count
      prisma.book.count({ where }),

      // Distinct authors with book counts in this scope (or all authors)
      prisma.author.findMany({
        where: categorySlug
          ? {
              books: {
                some: {
                  categories: {
                    some: {
                      category: { slug: categorySlug },
                    },
                  },
                },
              },
            }
          : {},
        select: {
          id: true,
          slug: true,
          name: true,
          _count: {
            select: { books: true },
          },
        },
        orderBy: { name: "asc" },
      }),

      // Distinct publishers with book counts in this scope (or all publishers)
      prisma.publisher.findMany({
        where: categorySlug
          ? {
              books: {
                some: {
                  categories: {
                    some: {
                      category: { slug: categorySlug },
                    },
                  },
                },
              },
            }
          : {},
        select: {
          id: true,
          slug: true,
          name: true,
          _count: {
            select: { books: true },
          },
        },
        orderBy: { name: "asc" },
      }),

      // Distinct languages
      prisma.book.groupBy({
        by: ["language"],
        where: categorySlug
          ? {
              categories: {
                some: {
                  category: { slug: categorySlug },
                },
              },
            }
          : {},
        _count: {
          id: true,
        },
      }),

      // Min and Max price aggregate
      prisma.book.aggregate({
        where: categorySlug
          ? {
              categories: {
                some: {
                  category: { slug: categorySlug },
                },
              },
            }
          : {},
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

  const facets: FilterFacets = {
    authors: allAuthors.map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      count: a._count.books,
    })),
    publishers: allPublishers.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      count: p._count.books,
    })),
    languages: allLanguages.map((l) => ({
      name: l.language,
      count: l._count.id,
    })),
    minPrice: Math.floor(priceAggregate._min.price || 0),
    maxPrice: Math.ceil(priceAggregate._max.price || 1000),
  };

  return {
    books,
    totalCount,
    currentPage: page,
    pageSize,
    facets,
  };
}
