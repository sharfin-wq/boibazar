import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function Footer() {
  const shopCategories = [
    { name: "Fiction", slug: "fiction" },
    { name: "Non-Fiction", slug: "non-fiction" },
    { name: "Self-Help & Motivational", slug: "self-help-motivational" },
    { name: "Religious", slug: "religious" },
    { name: "Children's Books", slug: "childrens-books" },
    { name: "Academic", slug: "academic" },
    { name: "Science Fiction & Fantasy", slug: "sci-fi-fantasy" },
    { name: "Biography & Memoir", slug: "biography-memoir" },
  ];

  return (
    <footer className="w-full border-t border-border bg-card/60 text-card-foreground mt-auto">
      {/* Value Proposition Highlights Banner */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Fast Nationwide Delivery</p>
                <p className="text-[11px] text-muted-foreground">Within 24-72 hours across BD</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">100% Original Books</p>
                <p className="text-[11px] text-muted-foreground">Directly from verified publishers</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">7-Day Easy Returns</p>
                <p className="text-[11px] text-muted-foreground">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Curated Bengali Catalog</p>
                <p className="text-[11px] text-muted-foreground">Thousands of timeless titles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-bold text-xl text-primary hover:opacity-90 transition-opacity"
            >
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="leading-none text-xl font-extrabold tracking-tight">BoiBazar</span>
                <span className="text-[10px] text-muted-foreground font-normal tracking-wide mt-0.5">
                  বইবাজার • Online Book Shop
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              BoiBazar is Bangladesh&rsquo;s premier online bookstore. We connect avid readers with
              the best Bengali classics, contemporary fiction, academic resources, and international
              bestsellers with unmatched customer care.
            </p>

            <div className="space-y-2 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>Nilkhet & Banglabazar Book District, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>Customer Care: +880 9612-000000 (9 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>support@boibazar.com.bd</span>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {shopCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/search"
                  className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  All Books →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Columns */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Company & Explore
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/authors" className="hover:text-primary transition-colors font-medium">
                    Authors Directory
                  </Link>
                </li>
                <li>
                  <Link href="/publishers" className="hover:text-primary transition-colors font-medium">
                    Publishers Directory
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary transition-colors">
                    Careers <span className="text-[10px] text-primary font-medium">(Hiring)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Literary Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Support
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact & Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-primary transition-colors">
                    Returns & Replacement
                  </Link>
                </li>
                <li>
                  <Link href="/style-guide" className="hover:text-primary transition-colors">
                    Design Style Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Newsletter
              </h3>
              <p className="text-xs text-muted-foreground">
                Subscribe to get author spotlight updates, weekly bestsellers, and exclusive promo codes.
              </p>
            </div>

            <NewsletterSignup />

            {/* Payment Methods Badges */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                We Accept
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                <span className="px-2 py-1 rounded bg-muted border border-border font-medium text-pink-600 dark:text-pink-400">
                  bKash
                </span>
                <span className="px-2 py-1 rounded bg-muted border border-border font-medium text-orange-600 dark:text-orange-400">
                  Nagad
                </span>
                <span className="px-2 py-1 rounded bg-muted border border-border font-medium text-purple-600 dark:text-purple-400">
                  Rocket
                </span>
                <span className="px-2 py-1 rounded bg-muted border border-border font-medium text-blue-600 dark:text-blue-400">
                  Visa / Master
                </span>
                <span className="px-2 py-1 rounded bg-muted border border-border font-medium text-emerald-600 dark:text-emerald-400">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sub-bar */}
      <div className="border-t border-border/80 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p>© 2026 BoiBazar. All rights reserved. Built with passion for readers.</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookie Preferences
              </Link>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/70 text-center">
            Built by{" "}
            <a
              href="https://github.com/sharfin-wq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Sharfin Ahmed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
