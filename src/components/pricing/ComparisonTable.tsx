"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

interface Feature {
  name: string;
  starter: boolean | string;
  growth: boolean | string;
  enterprise: boolean | string;
  category?: string;
}

const features: Feature[] = [
  { name: "AI Voice Receptionist", starter: true, growth: true, enterprise: true },
  { name: "AI SMS Agent", starter: true, growth: true, enterprise: true },
  { name: "AI Email Agent", starter: true, growth: true, enterprise: true },
  { name: "AI Website Chat Widget", starter: true, growth: true, enterprise: true },
  { name: "Included Voice Minutes", starter: "100", growth: "500", enterprise: "Unlimited†" },
  { name: "Included SMS", starter: "200", growth: "1000", enterprise: "Unlimited†" },
  { name: "Multi-location", starter: false, growth: true, enterprise: true },
  { name: "Priority Support", starter: false, growth: false, enterprise: true },
  { name: "Dedicated Manager", starter: false, growth: false, enterprise: true },
  { name: "Advanced Automations", starter: false, growth: true, enterprise: true },
];
export function ComparisonTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="overflow-x-auto"
    >
      <table className="w-full border-collapse min-w-[600px] md:min-w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 md:py-4 px-3 md:px-4 font-semibold text-base md:text-lg">Features</th>
            <th className="text-center py-3 md:py-4 px-3 md:px-4 font-semibold text-base md:text-lg">
              <div className="inline-flex items-center justify-center px-2 py-1 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent text-xs md:text-sm">
                  Starter AI
                </span>
              </div>
            </th>
            <th className="text-center py-3 md:py-4 px-3 md:px-4 font-semibold text-base md:text-lg opacity-70">
              <div className="inline-flex items-center justify-center px-2 py-1 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent text-xs md:text-sm">
                  Growth AI
                </span>
              </div>
            </th>
            <th className="text-center py-3 md:py-4 px-3 md:px-4 font-semibold text-base md:text-lg opacity-70">
              <div className="inline-flex items-center justify-center px-2 py-1 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent text-xs md:text-sm">
                  Enterprise AI
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              {feature.category && (
                <tr className="bg-muted/30">
                  <td colSpan={4} className="py-2 md:py-3 px-3 md:px-4 font-semibold text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                    {feature.category}
                  </td>
                </tr>
              )}
              <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-medium">{feature.name}</td>
                <td className="py-3 md:py-4 px-3 md:px-4 text-center">
                  <FeatureValue value={feature.starter} gradient="from-blue-500 to-cyan-500" isActive={true} />
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4 text-center opacity-70">
                  <FeatureValue value={feature.growth} gradient="from-indigo-500 to-violet-500" isActive={false} />
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4 text-center opacity-70">
                  <FeatureValue value={feature.enterprise} gradient="from-amber-500 to-orange-500" isActive={false} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="mt-4 md:mt-6 text-xs md:text-sm text-muted-foreground">
        <p>† Available with custom contract</p>
      </div>
    </motion.div>
  );
}

function FeatureValue({ value, gradient, isActive = true }: { value: boolean | string; gradient: string; isActive?: boolean }) {
  if (typeof value === "string") {
    return <span className="text-xs md:text-sm font-medium">{value}</span>;
  }
  if (value) {
    return (
      <div className="inline-flex items-center justify-center">
        <div className={`p-1 rounded-full bg-gradient-to-r ${gradient}`}>
          <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
        </div>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center justify-center">
      <Minus className={`w-3 h-3 md:w-4 md:h-4 ${isActive ? "text-muted-foreground/50" : "text-muted-foreground/30"}`} />
    </div>
  );
}
