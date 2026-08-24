import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Gift, Sparkles, BookOpen } from "lucide-react";

export function HomeNewsletterBand() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-background border border-border/80 shadow-md p-6 sm:p-10 lg:p-12">
      {/* Decorative background glow & shapes */}
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* Left Copy & Value Points */}
        <div className="space-y-3 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join Our Literary Circle</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            Stay in the Literary Loop
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Subscribe to BoiBazar’s weekly digest for author spotlights, new book arrivals, curated reading lists, and exclusive subscriber discounts.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-foreground/80 font-medium">
            <span className="flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-primary" />
              <span>৳100 Welcome Voucher</span>
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Weekly Book Recommendations</span>
            </span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full md:max-w-md p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="space-y-2 mb-3">
            <h3 className="text-sm font-bold text-foreground">Subscribe to Newsletter</h3>
            <p className="text-xs text-muted-foreground">
              Enter your email to receive weekly updates & promo codes.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </div>
    </section>
  );
}
