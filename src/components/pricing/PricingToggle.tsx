"use client";

import { motion } from "framer-motion";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (yearly: boolean) => void;
}

export function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`text-sm font-medium transition-colors ${
          !isYearly ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        Monthly
      </span>
      
      <button
        onClick={() => onToggle(!isYearly)}
        className="relative w-16 h-8 rounded-full bg-muted p-1 transition-colors hover:bg-muted/80"
        aria-label={isYearly ? "Switch to monthly billing" : "Switch to yearly billing"}
      >
        <motion.div
          className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg"
          animate={{ x: isYearly ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${
            isYearly ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          Yearly
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm"
        >
          Save 20%
        </motion.span>
      </div>
    </div>
  );
}

