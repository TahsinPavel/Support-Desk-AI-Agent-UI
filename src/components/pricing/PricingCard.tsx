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
  overages?: string[];
  resolutionCost?: string;
  popular?: boolean;
  enterprise?: boolean;
  comingSoon?: boolean;
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
  const yearlyTotal = tier.yearlyPrice ? tier.yearlyPrice * 12 : 0;

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
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-gradient-to-r ${gradient} text-white text-xs md:text-sm font-semibold shadow-lg`}
          >
            Most Popular
          </motion.div>
        </div>
      )}

      <div
        className={`relative h-full p-6 md:p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex flex-col ${
          tier.popular
            ? "bg-background/80 border-indigo-500/50 shadow-2xl shadow-indigo-500/10"
            : tier.comingSoon
            ? "bg-background/30 border-border/30 opacity-80"
            : "bg-background/50 border-border/50 hover:border-border hover:shadow-lg"
        }`}
      >
        {/* Icon */}
        <div className={`inline-flex p-2 md:p-3 rounded-2xl bg-gradient-to-br ${gradient} mb-3 md:mb-4`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>

        {/* Title & Description */}
        <div className="mb-5 md:mb-6">
          <h3 className="text-xl md:text-2xl font-bold mb-2">{tier.name}</h3>
          <p className={`text-xs md:text-sm ${tier.comingSoon ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-5 md:mb-6">
          {tier.comingSoon ? (
            <div className="flex flex-col items-center justify-center py-3 md:py-4">
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent mb-1 md:mb-2">
                {tier.priceLabel}
              </div>
              <span className="text-xs text-muted-foreground">Stay tuned for updates</span>
            </div>
          ) : tier.price !== null ? (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-bold">${displayPrice}</span>
                <span className="text-muted-foreground text-sm md:text-base">/month</span>
              </div>
              {isYearly && tier.yearlyPrice && (
                <p className="text-xs md:text-sm text-emerald-500 mt-1">
                  Billed annually (${yearlyTotal}/year)
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-3 md:py-4">
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {tier.priceLabel || "Custom Pricing"}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <Button
            onClick={onCheckout}
            size="lg"
            disabled={tier.comingSoon}
            className={`w-full mb-6 md:mb-8 text-sm md:text-base ${
              tier.comingSoon
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : tier.popular
                ? `bg-gradient-to-r ${gradient} hover:opacity-90 shadow-lg shadow-indigo-500/25`
                : tier.enterprise
                ? `bg-gradient-to-r ${gradient} hover:opacity-90`
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {tier.comingSoon ? "Coming Soon" : tier.enterprise ? "Contact Sales" : "Get Started"}
          </Button>
        </div>

        {/* Features */}
        <ul className="space-y-2 md:space-y-3">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 md:gap-3">
              <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${gradient}`}>
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
              </div>
              <span className={`text-xs md:text-sm ${tier.comingSoon ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Overages */}
        {tier.overages && (
          <div className="mt-5 md:mt-6 pt-3 md:pt-4 border-t border-border/50">
            <h4 className="text-xs md:text-sm font-semibold mb-1.5 md:mb-2 text-muted-foreground">Overages</h4>
            <ul className="space-y-1">
              {tier.overages.map((overage, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary/30"></div>
                  {overage}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
