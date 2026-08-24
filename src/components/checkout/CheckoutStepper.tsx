"use client";

import * as React from "react";
import { MapPin, ClipboardCheck, CreditCard, CheckCircle2, Check } from "lucide-react";

export type CheckoutStepNumber = 1 | 2 | 3 | 4;

interface CheckoutStepperProps {
  currentStep: CheckoutStepNumber;
}

const steps = [
  { step: 1, label: "Address", icon: MapPin },
  { step: 2, label: "Review", icon: ClipboardCheck },
  { step: 3, label: "Payment", icon: CreditCard },
  { step: 4, label: "Confirmation", icon: CheckCircle2 },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="w-full py-4 px-2 sm:px-6 mb-6 sm:mb-8 rounded-3xl bg-card border border-border/80 shadow-xs">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-muted -z-0" />
        <div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 -z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 3rem)",
          }}
        />

        {/* Stepper Nodes */}
        {steps.map(({ step, label, icon: Icon }) => {
          const isCompleted = currentStep > step;
          const isCurrent = currentStep === step;

          return (
            <div key={step} className="flex flex-col items-center gap-1.5 z-10 relative">
              <div
                className={`size-9 sm:size-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-xs ${
                  isCompleted
                    ? "bg-primary text-primary-foreground scale-100"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {isCompleted ? (
                  <Check className="size-4 sm:size-5 stroke-[2.5]" />
                ) : (
                  <Icon className="size-4 sm:size-4.5" />
                )}
              </div>

              <span
                className={`text-[11px] sm:text-xs font-semibold tracking-tight transition-colors ${
                  isCurrent
                    ? "text-primary font-bold"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
