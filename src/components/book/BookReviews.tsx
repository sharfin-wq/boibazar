"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Star,
  MessageSquare,
  Sparkles,
  Send,
  Loader2,
  LogIn,
  CheckCircle2,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/RatingStars";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    email?: string | null;
  };
}

interface BookReviewsProps {
  bookSlug: string;
  bookTitle: string;
  initialReviews: ReviewItem[];
  isLoggedIn: boolean;
  currentUser?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor - Not recommended",
  2: "Fair - Needs improvement",
  3: "Good - Enjoyable read",
  4: "Very Good - Highly recommended",
  5: "Excellent - A masterpiece!",
};

export function BookReviews({
  bookSlug,
  bookTitle,
  initialReviews,
  isLoggedIn,
  currentUser,
}: BookReviewsProps) {
  const router = useRouter();
  const [reviews, setReviews] = React.useState<ReviewItem[]>(initialReviews);
  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  // Sync state if initialReviews prop updates
  React.useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  // Aggregate statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  // Star breakdown (5 down to 1)
  const starCounts = React.useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (counts[r.rating] !== undefined) {
        counts[r.rating]++;
      }
    });
    return counts;
  }, [reviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please sign in to submit a review.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating between 1 and 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/books/${bookSlug}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Optimistically prepend the new review to local state
      const createdReview: ReviewItem = {
        ...data.review,
        createdAt: data.review.createdAt || new Date().toISOString(),
        user: {
          id: currentUser?.id || "current-user",
          name: currentUser?.name || "You",
        },
      };

      setReviews((prev) => [createdReview, ...prev]);
      setComment("");
      setRating(5);
      setHoverRating(0);

      toast.success("Review submitted!", {
        description: `Thank you for sharing your review of "${bookTitle}".`,
      });

      // Background refresh server components
      router.refresh();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Something went wrong while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateVal: string | Date) => {
    try {
      const d = new Date(dateVal);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(d);
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-8" id="reviews-section">
      {/* 1. Review Summary Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-muted/30 border border-border/80">
        {/* Left: Overall Score */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border/70 space-y-2">
          <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            {totalReviews > 0 ? avgRating.toFixed(1) : "0.0"}
          </div>
          <RatingStars rating={avgRating} size="lg" />
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Based on {totalReviews} {totalReviews === 1 ? "customer review" : "customer reviews"}
          </p>
          {isLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="mt-2 text-xs font-semibold gap-1.5 rounded-full"
            >
              <MessageSquare className="size-3.5" />
              <span>Write a Review</span>
            </Button>
          )}
        </div>

        {/* Right: Star Breakdown Progress Bars */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-2 px-2 sm:px-4">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 shrink-0 font-medium text-foreground">
                  <span>{stars}</span>
                  <Star className="size-3 text-amber-500 fill-amber-400" />
                </div>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right text-muted-foreground font-mono text-[11px] shrink-0">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Write Review Form OR Sign In Prompt */}
      {isLoggedIn ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">Write a Review</h3>
                <p className="text-xs text-muted-foreground">
                  Share your experience with other readers
                </p>
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmitReview} className="space-y-4">
            {/* Interactive Star Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Overall Rating <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded-md text-muted-foreground hover:text-amber-500 transition-all transform hover:scale-115 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Rate ${starVal} out of 5 stars`}
                    >
                      <Star
                        className={cn(
                          "size-7 transition-colors",
                          isFilled
                            ? "text-amber-500 fill-amber-400 stroke-amber-500"
                            : "text-muted-foreground/30 fill-muted-foreground/10"
                        )}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-medium text-muted-foreground ml-2">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label
                htmlFor="review-comment"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Your Review (Optional)
              </label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`What did you think of "${bookTitle}"? What were your favorite themes or takeaways?`}
                className="min-h-[110px] text-sm"
                maxLength={2000}
              />
              <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
                <span>Keep your feedback respectful and spoiler-free.</span>
                <span>{comment.length} / 2000</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-semibold text-xs h-10 px-6 gap-2 rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Submit Review</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* Guest Sign In Prompt Card */
        <div className="p-6 sm:p-8 rounded-3xl bg-muted/40 border border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-card border border-border text-primary shadow-xs">
              <LogIn className="size-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm sm:text-base text-foreground">
                Sign in to write a review
              </h4>
              <p className="text-xs text-muted-foreground max-w-md">
                Have you read this book? Log in to your BoiBazar account to share your thoughts with fellow readers.
              </p>
            </div>
          </div>

          <Link href={`/login?callbackUrl=/book/${bookSlug}`}>
            <Button size="sm" className="font-semibold text-xs px-5 h-9 rounded-xl shrink-0">
              Sign In to Review
            </Button>
          </Link>
        </div>
      )}

      {/* 3. Existing Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span>Customer Reviews</span>
            <span className="text-xs font-normal text-muted-foreground">({totalReviews})</span>
          </h3>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3.5">
            {reviews.map((rev) => {
              const reviewerName = rev.user?.name || "Verified Reader";
              const initials = reviewerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-3 transition-colors hover:border-border"
                >
                  {/* Top: Reviewer Info + Rating + Date */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="size-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                        {initials || <UserIcon className="size-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">
                            {reviewerName}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-full">
                            <CheckCircle2 className="size-2.5" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{formatDate(rev.createdAt)}</p>
                      </div>
                    </div>

                    <RatingStars rating={rev.rating} size="sm" />
                  </div>

                  {/* Comment Body */}
                  {rev.comment && (
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line pl-12">
                      {rev.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
            <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <MessageSquare className="size-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                No reviews yet
              </h4>
              <p className="text-xs text-muted-foreground">
                Be the first person to share your thoughts and review on &ldquo;{bookTitle}&rdquo;!
              </p>
            </div>
            {isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="text-xs font-medium mt-1"
              >
                Write the First Review
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
