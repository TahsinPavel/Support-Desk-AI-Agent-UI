"use client";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (yearly: boolean) => void;
}

export function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
  return (
    <div className="inline-flex items-center justify-center p-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border">
      <button
        onClick={() => onToggle(false)}
        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          !isYearly
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Monthly
      </button>
      
      <button
        onClick={() => onToggle(true)}
        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
          isYearly
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Yearly
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white">
          Save 20%
        </span>
      </button>
    </div>
  );
}