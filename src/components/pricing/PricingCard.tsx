"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";

export interface PricingTier {
  name: string;
  description: string;
  price: number | null;
  yearlyPrice: number | null;
  priceLabel?: string;
  features: string[];
  resolutionCost: string;
  popular?: boolean;
  enterprise?: boolean;
  icon: "starter" | "growth" | "enterprise";
}

interface PricingCardProps {
  tier: PricingTier;
  isYearly: boolean;
  onCheckout: () => void;
  index: number;
}

const icons = {
  starter: Sparkles,
  growth: Zap,
  enterprise: Building2,
};

const gradients = {
  starter: "from-blue-500 to-cyan-500",
  growth: "from-indigo-500 to-violet-500",
  enterprise: "from-amber-500 to-orange-500",
};

export function PricingCard({ tier, isYearly, onCheckout, index }: PricingCardProps) {
  const Icon = icons[tier.icon];
  const gradient = gradients[tier.icon];
  const displayPrice = isYearly && tier.yearlyPrice ? tier.yearlyPrice : tier.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative group h-full ${tier.popular ? "z-10" : ""}`}
    >
      {/* Glow effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
      />

      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-lg`}
          >
            Most Popular
          </motion.div>
        </div>
      )}

      <div
        className={`relative h-full p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
          tier.popular
            ? "bg-background/80 border-indigo-500/50 shadow-2xl shadow-indigo-500/10"
            : "bg-background/50 border-border/50 hover:border-border"
        }`}
      >
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} mb-6`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
        <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>

        {/* Price */}
        <div className="mb-6">
          {tier.price !== null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">${displayPrice}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          ) : (
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {tier.priceLabel || "Custom Pricing"}
            </div>
          )}
          {isYearly && tier.yearlyPrice && (
            <p className="text-sm text-emerald-500 mt-1">
              Billed annually (${tier.yearlyPrice * 12}/year)
            </p>
          )}
        </div>

        {/* Resolution cost */}
        <div className="mb-6 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
          <span className="text-sm text-muted-foreground">AI Resolution: </span>
          <span className="text-sm font-semibold">{tier.resolutionCost}</span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onCheckout}
          size="lg"
          className={`w-full mb-8 ${
            tier.popular
              ? `bg-gradient-to-r ${gradient} hover:opacity-90 shadow-lg shadow-indigo-500/25`
              : tier.enterprise
              ? `bg-gradient-to-r ${gradient} hover:opacity-90`
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          {tier.enterprise ? "Contact Sales" : "Start Free Trial"}
        </Button>

        {/* Features */}
        <ul className="space-y-3">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${gradient}`}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

