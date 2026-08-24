"use client"

import * as React from "react"
import {
  BookOpen,
  Sparkles,
  Palette,
  Type,
  Layers,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react"
import { PriceTag } from "@/components/PriceTag"
import { RatingStars } from "@/components/RatingStars"
import { StockBadge } from "@/components/StockBadge"
import { BookCard } from "@/components/BookCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function StyleGuidePage() {
  const [isDark, setIsDark] = React.useState(false)

  // Toggle dark class on document element
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }

  // Sample book data for the BookCard showcase
  const sampleBooks = [
    {
      id: "1",
      title: "দেয়াল (Deyal)",
      author: "হুমায়ূন আহমেদ (Humayun Ahmed)",
      price: 480,
      originalPrice: 600,
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
      rating: 4.8,
      reviewsCount: 342,
      stockCount: 18,
      category: "ঐতিহাসিক উপন্যাস",
      badgeText: "Bestseller",
    },
    {
      id: "2",
      title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
      author: "James Clear",
      price: 520,
      originalPrice: 750,
      coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      rating: 4.9,
      reviewsCount: 1250,
      stockCount: 24,
      category: "Self Development",
      badgeText: "Top Rated",
    },
    {
      id: "3",
      title: "পথের পাঁচালী (Pather Panchali)",
      author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
      price: 320,
      originalPrice: 400,
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
      rating: 4.9,
      reviewsCount: 512,
      stockCount: 3, // Low stock demo
      category: "ক্লাসিক সাহিত্য",
    },
    {
      id: "4",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      price: 450,
      originalPrice: 550,
      coverImage: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=600&auto=format&fit=crop",
      rating: 4.7,
      reviewsCount: 890,
      stockCount: 0, // Out of stock demo
      category: "Finance & Wealth",
    },
    {
      id: "5",
      title: "একাত্তরের দিনগুলি",
      author: "জাহানারা ইমাম (Jahanara Imam)",
      price: 380,
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
      rating: 5.0,
      reviewsCount: 410,
      stockCount: 12,
      category: "মুক্তিযুদ্ধ ও স্মৃতিকথা",
      badgeText: "Classic",
    },
    {
      id: "6",
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      price: 680,
      originalPrice: 850,
      coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e37072?q=80&w=600&auto=format&fit=crop",
      rating: 4.6,
      reviewsCount: 620,
      stockCount: 7,
      category: "History & Science",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
                Boi<span className="text-primary">Bazar</span>
              </h1>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                Phase 2 Style Guide
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Design System, Brand Tokens & Reusable Component Library
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-full border-border hover:bg-muted"
          >
            {isDark ? (
              <>
                <Sun className="size-4 text-amber-500" />
                <span className="text-xs">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="size-4 text-secondary" />
                <span className="text-xs">Dark Mode</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
        {/* Intro Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-muted/40 to-card border border-border p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="size-3.5" />
              Design System & Brand Identity
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Warm, Literary & Modern Aesthetics
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Crafted specifically for BoiBazar. Featuring warm maroon (<span className="text-primary font-semibold">#8B1E2D</span>) for primary CTAs and discount highlights, deep navy (<span className="text-secondary font-semibold">#152238</span>) for authoritative branding, a warm off-white canvas (<span className="font-semibold text-foreground">#FAF8F5</span>), and crisp Inter typography.
            </p>
          </div>
        </section>

        {/* Section 1: Color Palette */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <Palette className="size-4" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">1. Color Palette Tokens</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tailwind CSS variables mapped in <code className="bg-muted px-1 py-0.5 rounded text-xs">src/app/globals.css</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Primary Maroon */}
            <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow transition-shadow">
              <div className="h-24 bg-primary flex items-end p-3">
                <span className="text-primary-foreground text-xs font-bold px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
                  Primary
                </span>
              </div>
              <CardContent className="p-3.5 space-y-1">
                <p className="font-semibold text-sm text-foreground">Warm Maroon</p>
                <p className="text-xs text-muted-foreground font-mono">--primary</p>
                <p className="text-[11px] text-muted-foreground/80 pt-1">
                  Buttons, sale prices, discount badges, active states
                </p>
              </CardContent>
            </Card>

            {/* Secondary Deep Navy */}
            <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow transition-shadow">
              <div className="h-24 bg-secondary flex items-end p-3">
                <span className="text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
                  Secondary
                </span>
              </div>
              <CardContent className="p-3.5 space-y-1">
                <p className="font-semibold text-sm text-foreground">Deep Navy</p>
                <p className="text-xs text-muted-foreground font-mono">--secondary</p>
                <p className="text-[11px] text-muted-foreground/80 pt-1">
                  Brand anchors, secondary badges, deep headers
                </p>
              </CardContent>
            </Card>

            {/* Warm Off-White Background */}
            <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow transition-shadow">
              <div className="h-24 bg-background border-b border-border flex items-end p-3">
                <span className="text-foreground text-xs font-bold px-2 py-0.5 rounded bg-muted/60 backdrop-blur-sm border border-border">
                  Background
                </span>
              </div>
              <CardContent className="p-3.5 space-y-1">
                <p className="font-semibold text-sm text-foreground">Warm Off-White</p>
                <p className="text-xs text-muted-foreground font-mono">--background</p>
                <p className="text-[11px] text-muted-foreground/80 pt-1">
                  Bookstore paper tone (not harsh sterile white)
                </p>
              </CardContent>
            </Card>

            {/* Muted Gray */}
            <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow transition-shadow">
              <div className="h-24 bg-muted flex items-end p-3">
                <span className="text-muted-foreground text-xs font-bold px-2 py-0.5 rounded bg-card/60 backdrop-blur-sm border border-border">
                  Muted
                </span>
              </div>
              <CardContent className="p-3.5 space-y-1">
                <p className="font-semibold text-sm text-foreground">Soft Muted Gray</p>
                <p className="text-xs text-muted-foreground font-mono">--muted</p>
                <p className="text-[11px] text-muted-foreground/80 pt-1">
                  Card surfaces, subtle dividers &amp; struck-through prices
                </p>
              </CardContent>
            </Card>

            {/* Success Green */}
            <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow transition-shadow">
              <div className="h-24 bg-success flex items-end p-3">
                <span className="text-success-foreground text-xs font-bold px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
                  Success
                </span>
              </div>
              <CardContent className="p-3.5 space-y-1">
                <p className="font-semibold text-sm text-foreground">Emerald Green</p>
                <p className="text-xs text-muted-foreground font-mono">--success</p>
                <p className="text-[11px] text-muted-foreground/80 pt-1">
                  &ldquo;In Stock&rdquo; indicators &amp; success confirmations
                </p>
              </CardContent>
            </Card>

            {/* Destructive / Alert Red */}
            <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow transition-shadow">
              <div className="h-24 bg-destructive flex items-end p-3">
                <span className="text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
                  Destructive
                </span>
              </div>
              <CardContent className="p-3.5 space-y-1">
                <p className="font-semibold text-sm text-foreground">Alert Red</p>
                <p className="text-xs text-muted-foreground font-mono">--destructive</p>
                <p className="text-[11px] text-muted-foreground/80 pt-1">
                  &ldquo;Out of Stock&rdquo; notices, errors &amp; destructive actions
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Typography */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <Type className="size-4" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">2. Typography &amp; Fonts</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Base font loaded via <code className="bg-muted px-1 py-0.5 rounded text-xs">next/font/google</code> (Inter)
              </p>
            </div>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* English Scale */}
                <div className="space-y-4">
                  <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    English Hierarchy
                  </span>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">H1 · 36px Bold</span>
                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        The Best Bengali Book Collection
                      </h1>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">H2 · 28px SemiBold</span>
                      <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Featured Books &amp; New Arrivals
                      </h2>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">H3 · 20px Medium</span>
                      <h3 className="text-lg font-semibold text-foreground">
                        Author Spotlight: Humayun Ahmed
                      </h3>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Body · 15px Regular</span>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Discover thousands of authentic novels, academic textbooks, translations, and bestsellers delivered right to your doorstep across Bangladesh.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bengali Rendering */}
                <div className="space-y-4">
                  <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    Bengali Script Rendering (বাংলা টাইপোগ্রাফি)
                  </span>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">শিরোনাম · বোল্ড</span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        বইবাজার — আপনার প্রিয় বইয়ের ঠিকানা
                      </h2>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">উপ-শিরোনাম · মিডিয়াম</span>
                      <h3 className="text-lg font-semibold text-primary">
                        জনপ্রিয় উপন্যাস ও সমকালীন সাহিত্য সংকলন
                      </h3>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">মূল বিবরণী · রেগুলার</span>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        &ldquo;মানুষের বেঁচে থাকার জন্য সবচেয়ে বেশি যা প্রয়োজন তা হলো আশা।&rdquo; — হুমায়ূন আহমেদ। বইপড়ুয়াদের জন্য বইবাজার নিয়ে এসেছে দেশ-বিদেশের লক্ষাধিক বইয়ের সুবিশাল সমাহার।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Component Showcase */}
        <section className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <Layers className="size-4" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">3. Reusable Component Suite</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                PriceTag, RatingStars, StockBadge, and BookCard
              </p>
            </div>
          </div>

          {/* 3.1 PriceTag Component Demo */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>PriceTag Component</span>
                <code className="text-xs font-normal text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                  &lt;PriceTag /&gt;
                </code>
              </CardTitle>
              <CardDescription>
                Renders selling price in warm maroon, original price struck-through in muted gray, and an auto-computed discount percentage badge.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 rounded-xl bg-muted/30 border border-border/60">
                {/* Standard Discount */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Standard Discount (20%)</span>
                  <div>
                    <PriceTag price={480} originalPrice={600} />
                  </div>
                </div>

                {/* Big Discount */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Big Discount (40%)</span>
                  <div>
                    <PriceTag price={450} originalPrice={750} />
                  </div>
                </div>

                {/* No Discount */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Regular Price (No discount)</span>
                  <div>
                    <PriceTag price={350} />
                  </div>
                </div>

                {/* USD Currency */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Custom Currency ($ USD)</span>
                  <div>
                    <PriceTag price={19.99} originalPrice={29.99} currency="$" />
                  </div>
                </div>
              </div>

              {/* Size Variants */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Size Variants (sm / default / lg)
                </span>
                <div className="flex flex-wrap items-center gap-8 p-4 rounded-xl bg-muted/20 border border-border/40">
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground block">size=&quot;sm&quot;</span>
                    <PriceTag price={240} originalPrice={300} size="sm" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground block">size=&quot;default&quot;</span>
                    <PriceTag price={480} originalPrice={600} size="default" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground block">size=&quot;lg&quot; (Hero/Product Page)</span>
                    <PriceTag price={950} originalPrice={1250} size="lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3.2 RatingStars Component Demo */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>RatingStars Component</span>
                <code className="text-xs font-normal text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                  &lt;RatingStars /&gt;
                </code>
              </CardTitle>
              <CardDescription>
                Shows 1–5 stars filled accurately based on fractional scores with optional score and review counts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 rounded-xl bg-muted/30 border border-border/60">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">5.0 Star Rating</span>
                  <div>
                    <RatingStars rating={5.0} showScore={true} reviewsCount={412} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">4.7 Fractional Rating</span>
                  <div>
                    <RatingStars rating={4.7} showScore={true} reviewsCount={128} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">3.5 Mid-tier Rating</span>
                  <div>
                    <RatingStars rating={3.5} showScore={true} reviewsCount={45} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">2.0 Low Rating</span>
                  <div>
                    <RatingStars rating={2.0} showScore={true} reviewsCount={14} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">0.0 No Reviews</span>
                  <div>
                    <RatingStars rating={0} showScore={true} reviewsCount={0} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Large Size Variant</span>
                  <div>
                    <RatingStars rating={4.8} size="lg" showScore={true} reviewsCount={890} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3.3 StockBadge Component Demo */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>StockBadge Component</span>
                <code className="text-xs font-normal text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                  &lt;StockBadge /&gt;
                </code>
              </CardTitle>
              <CardDescription>
                Shows live stock availability: &quot;In Stock&quot; (green), &quot;Low Stock&quot; (amber warning), or &quot;Out of Stock&quot; (red/muted).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-muted/30 border border-border/60">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground block">In Stock (Normal)</span>
                  <StockBadge stockCount={25} />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground block">Low Stock (Threshold: 5)</span>
                  <StockBadge stockCount={3} lowStockThreshold={5} />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground block">Out of Stock</span>
                  <StockBadge stockCount={0} />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground block">Small Size Variant</span>
                  <StockBadge stockCount={15} size="sm" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground block">Boolean Prop (&lt;StockBadge inStock=&#123;true&#125; /&gt;)</span>
                  <StockBadge inStock={true} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3.4 BookCard Component Showcase Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>BookCard Component (Showcase Grid)</span>
                  <code className="text-xs font-normal text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                    &lt;BookCard /&gt;
                  </code>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  The primary reusable card for book listings with smooth hover lift, image zoom, ratings, price tags, and quick actions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {sampleBooks.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  originalPrice={book.originalPrice}
                  coverImage={book.coverImage}
                  rating={book.rating}
                  reviewsCount={book.reviewsCount}
                  stockCount={book.stockCount}
                  category={book.category}
                  badgeText={book.badgeText}
                  onAddToCart={() => alert(`Added "${book.title}" to cart!`)}
                  onAddToWishlist={() => alert(`Added "${book.title}" to wishlist!`)}
                />
              ))}
            </div>
          </div>

          {/* 3.5 Shadcn UI Primitives Integration Check */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>Shadcn UI Button &amp; Badge Variants Check</span>
              </CardTitle>
              <CardDescription>
                Verifying that base shadcn UI components inherit the custom palette tokens (Primary Maroon, Secondary Navy, Destructive, Muted).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Buttons
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default">Primary Maroon</Button>
                  <Button variant="secondary">Secondary Navy</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link Style</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large CTA</Button>
                </div>
              </div>

              <Separator />

              {/* Badges */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Badges
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">Primary Badge</Badge>
                  <Badge variant="secondary">Secondary Badge</Badge>
                  <Badge variant="outline">Outline Badge</Badge>
                  <Badge variant="destructive">Destructive Badge</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card py-8 px-4 sm:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 BoiBazar. Phase 2 Design System &amp; Style Guide.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-success font-medium">
              <CheckCircle2 className="size-3.5" />
              All components tested &amp; verified
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
