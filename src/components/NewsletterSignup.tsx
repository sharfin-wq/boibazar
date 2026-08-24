"use client";

import * as React from "react";
import { toast } from "sonner";
import { Send, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Success notification
    toast.success("Welcome to BoiBazar! You have successfully subscribed to our newsletter.", {
      description: `Updates will be sent to ${trimmed}.`,
    });

    setEmail("");
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="relative flex items-center">
        <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="w-full h-10 pl-9 pr-24 rounded-lg bg-background/80 hover:bg-background focus:bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs text-foreground placeholder:text-muted-foreground transition-all outline-none"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 h-8 px-3 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium gap-1 shadow-xs"
        >
          {isSubmitted ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Joined</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <Send className="h-3 w-3" />
            </>
          )}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        We respect your privacy. Unsubscribe anytime with one click.
      </p>
    </form>
  );
}
