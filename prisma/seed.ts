import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SeedCategory {
  id: string;
  slug: string;
  name: string;
  parentCategoryId?: string | null;
}

interface SeedAuthor {
  id: string;
  slug: string;
  name: string;
  bio?: string;
  photoUrl?: string;
}

interface SeedPublisher {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
}

interface SeedBook {
  id: string;
  slug: string;
  title: string;
  authorSlug: string;
  publisherSlug: string;
  categorySlugs: string[];
  description: string;
  coverImageUrl: string;
  price: number;
  discountPrice?: number | null;
  language?: string;
  pageCount?: number;
  isbn?: string;
  stock?: number;
  isFeatured?: boolean;
  soldCount?: number;
  publishedYear?: number;
}

interface SeedData {
  categories: SeedCategory[];
  authors: SeedAuthor[];
  publishers: SeedPublisher[];
  books: SeedBook[];
}

async function main() {
  console.log("🌱 Starting database seeding for BoiBazar...");

  const seedFilePath = path.join(process.cwd(), "data", "books-seed.json");
  if (!fs.existsSync(seedFilePath)) {
    throw new Error(`Seed data file not found at: ${seedFilePath}`);
  }

  const rawData = fs.readFileSync(seedFilePath, "utf-8");
  const data: SeedData = JSON.parse(rawData);

  // 1. Seed Categories
  console.log(`\n📁 Seeding ${data.categories.length} categories...`);
  const categoryMap = new Map<string, string>(); // slug -> id
  for (const cat of data.categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        parentCategoryId: cat.parentCategoryId ?? null,
      },
      create: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        parentCategoryId: cat.parentCategoryId ?? null,
      },
    });
    categoryMap.set(cat.slug, category.id);
  }
  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  // 2. Seed Authors
  console.log(`\n✍️ Seeding ${data.authors.length} authors...`);
  const authorMap = new Map<string, string>(); // slug -> id
  for (const author of data.authors) {
    const createdAuthor = await prisma.author.upsert({
      where: { slug: author.slug },
      update: {
        name: author.name,
        bio: author.bio ?? null,
        photoUrl: author.photoUrl ?? null,
      },
      create: {
        id: author.id,
        slug: author.slug,
        name: author.name,
        bio: author.bio ?? null,
        photoUrl: author.photoUrl ?? null,
      },
    });
    authorMap.set(author.slug, createdAuthor.id);
  }
  console.log(`✅ Seeded ${authorMap.size} authors.`);

  // 3. Seed Publishers
  console.log(`\n🏢 Seeding ${data.publishers.length} publishers...`);
  const publisherMap = new Map<string, string>(); // slug -> id
  for (const pub of data.publishers) {
    const createdPublisher = await prisma.publisher.upsert({
      where: { slug: pub.slug },
      update: {
        name: pub.name,
        logoUrl: pub.logoUrl ?? null,
      },
      create: {
        id: pub.id,
        slug: pub.slug,
        name: pub.name,
        logoUrl: pub.logoUrl ?? null,
      },
    });
    publisherMap.set(pub.slug, createdPublisher.id);
  }
  console.log(`✅ Seeded ${publisherMap.size} publishers.`);

  // 4. Seed Books and BookCategory links
  console.log(`\n📚 Seeding ${data.books.length} books and category links...`);
  let bookCount = 0;
  let bookCategoryCount = 0;
  let discountedCount = 0;

  for (const b of data.books) {
    const authorId = authorMap.get(b.authorSlug);
    const publisherId = publisherMap.get(b.publisherSlug);

    if (!authorId) {
      console.warn(`⚠️ Warning: Author slug "${b.authorSlug}" not found for book "${b.title}"`);
      continue;
    }
    if (!publisherId) {
      console.warn(`⚠️ Warning: Publisher slug "${b.publisherSlug}" not found for book "${b.title}"`);
      continue;
    }

    if (b.discountPrice && b.discountPrice < b.price) {
      discountedCount++;
    }

    const book = await prisma.book.upsert({
      where: { slug: b.slug },
      update: {
        title: b.title,
        authorId,
        publisherId,
        description: b.description,
        coverImageUrl: b.coverImageUrl,
        price: b.price,
        discountPrice: b.discountPrice ?? null,
        language: b.language ?? "Bengali",
        pageCount: b.pageCount ?? null,
        isbn: b.isbn ?? null,
        stock: b.stock ?? 0,
        isFeatured: b.isFeatured ?? false,
        soldCount: b.soldCount ?? 0,
        publishedYear: b.publishedYear ?? null,
      },
      create: {
        id: b.id,
        slug: b.slug,
        title: b.title,
        authorId,
        publisherId,
        description: b.description,
        coverImageUrl: b.coverImageUrl,
        price: b.price,
        discountPrice: b.discountPrice ?? null,
        language: b.language ?? "Bengali",
        pageCount: b.pageCount ?? null,
        isbn: b.isbn ?? null,
        stock: b.stock ?? 0,
        isFeatured: b.isFeatured ?? false,
        soldCount: b.soldCount ?? 0,
        publishedYear: b.publishedYear ?? null,
      },
    });

    bookCount++;

    // Connect categories
    for (const catSlug of b.categorySlugs) {
      const categoryId = categoryMap.get(catSlug);
      if (categoryId) {
        await prisma.bookCategory.upsert({
          where: {
            bookId_categoryId: {
              bookId: book.id,
              categoryId,
            },
          },
          update: {},
          create: {
            bookId: book.id,
            categoryId,
          },
        });
        bookCategoryCount++;
      } else {
        console.warn(`⚠️ Warning: Category slug "${catSlug}" not found for book "${b.title}"`);
      }
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`========================================`);
  console.log(`📊 Categories : ${categoryMap.size}`);
  console.log(`📊 Authors    : ${authorMap.size}`);
  console.log(`📊 Publishers : ${publisherMap.size}`);
  console.log(`📊 Books      : ${bookCount} (Discounted: ${discountedCount} / ${((discountedCount / bookCount) * 100).toFixed(1)}%)`);
  console.log(`📊 Relations  : ${bookCategoryCount} Book-Category links`);
  console.log(`========================================\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
