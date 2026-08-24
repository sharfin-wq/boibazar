# BoiBazar (বইবাজার) — Modern Bengali Bookstore Platform

**BoiBazar** is a modern, full-stack e-commerce web application dedicated to Bengali and international literature, featuring a rich literary catalog, full-text search with faceted filtering, interactive shopping cart, persistent wishlist, full multi-step checkout, authenticated customer account area, reviews, and responsive mobile-first UI.

---

## 🌟 Key Features

- **Rich Literary Catalog**: 50+ curated Bengali & international books across 8 major genres (Fiction, Non-Fiction, Self-Help & Motivational, Religious & Spiritual, Children's Books, Academic & Education, Science Fiction & Fantasy, Biography & Memoir).
- **Homepage Showcase**: Hero banner carousel with animated slides, genre quick-links, and dynamic database rails (*Trending Now*, *Best of Fiction*, *Self-Help & Mindset*, *Author Spotlight*, *New Releases*).
- **Search & Advanced Filtering**: Live search bar with debounced query suggestions, faceted filtering by Category, Price Range, Author, Publisher, and Customer Rating, plus dynamic sorting (*Bestselling*, *Price: Low to High*, *Price: High to Low*, *Customer Rating*, *Newest*).
- **Interactive Book Details**: Book cover gallery, pricing with discount badges, stock availability status, author & publisher cards, book specifications tab, and verified reader customer reviews with interactive star ratings.
- **Cart & Slide-over Drawer**: Real-time slide-over cart preview drawer and dedicated `/cart` page with line item steppers, line subtotals, free shipping threshold indicator (over ৳1000), and book recommendations rail.
- **Multi-Step Checkout**: Progress stepper (Address -> Review -> Payment -> Confirmation) with saved delivery address management, live calculations, and Cash on Delivery / Card payment demo stubs.
- **Account Area**:
  - Profile overview with inline display name editor.
  - Order history with status badges and dedicated `/account/orders/[id]` receipt view.
  - Saved addresses management (Create, Edit, Delete, Set Default).
  - Database-persisted Wishlist with "Move to Cart" and "Remove" actions.
- **Polish & Performance**:
  - Custom book-themed 404 page (`/not-found`).
  - Loading skeleton states with shadcn `Skeleton` across all routes.
  - Dynamic SEO Metadata with Next.js Metadata API and OpenGraph tags.
  - Responsive design optimized for 360px mobile, 768px tablet, and 1280px+ desktop.

---

## 📋 Prerequisites

- **Node.js**: `v18.17.0` or higher (`v20.x` recommended)
- **npm**: `v9.x` or higher (or `pnpm` / `yarn`)

---

## 🚀 Getting Started

Follow these steps in order to install dependencies, initialize the database, seed the catalog data, and run the development server:

### 1. Clone the repository & install dependencies
```bash
git clone <repository-url>
cd BoiBazar
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
# Database connection (SQLite local database)
DATABASE_URL="file:./dev.db"

# NextAuth.js Authentication Configuration
NEXTAUTH_SECRET="boibazar-secure-random-secret-key-replace-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize the Prisma Database Schema
Generate the Prisma Client and push the schema to SQLite:
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed the Database
Populate the database with initial categories, authors, publishers, books, user accounts, reviews, and test orders:
```bash
npm run seed
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔑 Demo Credentials

You can use the following seeded demo accounts to sign in immediately:

| Email | Password | Role / Details |
|---|---|---|
| `tanvir@example.com` | `password123` | Active Customer (Orders & Wishlist populated) |
| `demo@boibazar.com` | `password123` | Demo Account |

---

## ⚙️ Environment Variables Reference

| Variable | Description | Example / Default |
|---|---|---|
| `DATABASE_URL` | Prisma database connection string. Uses SQLite locally (`file:./dev.db`) or PostgreSQL / MySQL in production. | `file:./dev.db` |
| `NEXTAUTH_SECRET` | Secret key used to sign and encrypt NextAuth session JWT tokens and cookies. | `boibazar-secret-key-32-chars` |
| `NEXTAUTH_URL` | Canonical URL of your deployment. Used by NextAuth for redirect callbacks and CSRF protection. | `http://localhost:3000` |

---

## 📁 Project Structure

```
BoiBazar/
├── prisma/
│   ├── schema.prisma         # Prisma database schema definition
│   └── seed.ts               # Database seeder with curated books, authors, & reviews
├── public/                   # Static assets, logos, and placeholders
├── src/
│   ├── app/                  # Next.js App Router routes & pages
│   │   ├── account/          # Customer Account pages (Profile, Orders, Wishlist, Addresses)
│   │   ├── api/              # Backend API Route Handlers
│   │   │   ├── account/      # Account & profile mutation endpoints
│   │   │   ├── addresses/    # Saved addresses CRUD endpoint
│   │   │   ├── auth/         # NextAuth.js and registration endpoints
│   │   │   ├── books/        # Book reviews and suggestions endpoints
│   │   │   ├── cart/         # Shopping cart database sync endpoints
│   │   │   ├── orders/       # Order creation & detail endpoints
│   │   │   └── wishlist/     # Wishlist toggle and query endpoints
│   │   ├── author/           # Single Author biography & catalog page
│   │   ├── authors/          # Authors Directory page
│   │   ├── book/             # Book detail & product page
│   │   ├── cart/             # Dedicated Shopping Cart page
│   │   ├── category/         # Category listing & filtered catalog page
│   │   ├── checkout/         # Multi-step Checkout flow
│   │   ├── publisher/        # Publisher showcase & catalog page
│   │   ├── publishers/       # Publishers Directory page
│   │   ├── search/           # Full-text search and faceted filters page
│   │   ├── globals.css       # Global Tailwind CSS tokens & dark mode styling
│   │   ├── layout.tsx        # Root HTML layout with Header, Footer, and Providers
│   │   ├── loading.tsx       # Global homepage loading skeleton
│   │   ├── not-found.tsx     # Custom 404 page
│   │   └── page.tsx          # Homepage view
│   ├── components/           # Reusable UI & Feature components
│   │   ├── account/          # Profile form, address manager, wishlist grid, user dropdown
│   │   ├── book/             # Gallery, review form/list, specifications tabs, product view
│   │   ├── cart/             # Cart row, summary, drawer, view
│   │   ├── checkout/         # Stepper, address step, review step, payment step, confirmation
│   │   ├── home/             # Hero carousel, category quick links, book rails, author strip
│   │   ├── listing/          # Filter sidebar, top bar, pagination, book listing view
│   │   ├── providers/        # Client application providers (Session, Cart, Wishlist)
│   │   ├── skeletons/        # Reusable skeleton loaders (Card, Rail, Grid, Detail)
│   │   ├── ui/               # Base UI primitive components (Button, Card, Input, Dialog, etc.)
│   │   ├── Header.tsx        # Global Header with search bar, user menu, & cart badge
│   │   └── Footer.tsx        # Global Footer with newsletter signup & site links
│   ├── context/              # React Context Providers (CartContext, WishlistContext)
│   ├── lib/                  # Utilities, Prisma Client singleton, Auth helper, Catalog query helper
│   └── types/                # TypeScript type definitions and next-auth extensions
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🛠️ Build & Verification

To verify and build the production bundle:

```bash
# Run TypeScript type check
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
