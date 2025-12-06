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
  { category: "AI Channels", name: "AI Chat Agent", starter: true, growth: true, enterprise: true },
  { name: "AI Email Agent", starter: true, growth: true, enterprise: true },
  { name: "AI SMS Agent", starter: true, growth: true, enterprise: true },
  { name: "AI Voice Agent", starter: true, growth: true, enterprise: true },
  { name: "Phone Number Connectors", starter: "1", growth: "Multiple", enterprise: "Unlimited" },
  { name: "Email Connectors", starter: "1", growth: "Multiple", enterprise: "Unlimited" },
  { category: "Knowledge & AI", name: "Knowledge Base Sources", starter: "1", growth: "Custom (PDF, Notion, Web)", enterprise: "Unlimited" },
  { name: "Custom LLM Selection", starter: false, growth: false, enterprise: true },
  { name: "Multi-language Support", starter: false, growth: true, enterprise: true },
  { category: "Integrations", name: "CRM Integrations", starter: false, growth: "HubSpot, Salesforce, Pipedrive", enterprise: "All + Custom" },
  { name: "Workflow Automation", starter: false, growth: true, enterprise: true },
  { name: "IVR Call Routing", starter: false, growth: false, enterprise: true },
  { category: "Analytics", name: "Basic Analytics", starter: true, growth: true, enterprise: true },
  { name: "Advanced Analytics", starter: false, growth: true, enterprise: true },
  { name: "Voice Intelligence", starter: false, growth: false, enterprise: true },
  { category: "Security & Compliance", name: "HIPAA/SOC-2 Features", starter: false, growth: false, enterprise: true },
  { name: "SSO (SAML/OKTA)", starter: false, growth: false, enterprise: true },
  { name: "Call Recording", starter: false, growth: false, enterprise: true },
  { category: "Support", name: "Mobile-friendly Inbox", starter: true, growth: true, enterprise: true },
  { name: "Unlimited Inbound Messages", starter: true, growth: true, enterprise: true },
  { name: "Dedicated Account Manager", starter: false, growth: false, enterprise: true },
  { name: "Custom Onboarding", starter: false, growth: false, enterprise: true },
  { name: "SLA Uptime Guarantee", starter: false, growth: false, enterprise: true },
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
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4 font-semibold text-lg">Features</th>
            <th className="text-center py-4 px-4 font-semibold text-lg">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Starter AI
              </span>
            </th>
            <th className="text-center py-4 px-4 font-semibold text-lg">
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Growth AI
              </span>
            </th>
            <th className="text-center py-4 px-4 font-semibold text-lg">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Enterprise AI
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              {feature.category && (
                <tr className="bg-muted/30">
                  <td colSpan={4} className="py-3 px-4 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {feature.category}
                  </td>
                </tr>
              )}
              <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-4 px-4 text-sm">{feature.name}</td>
                <td className="py-4 px-4 text-center">
                  <FeatureValue value={feature.starter} gradient="from-blue-500 to-cyan-500" />
                </td>
                <td className="py-4 px-4 text-center">
                  <FeatureValue value={feature.growth} gradient="from-indigo-500 to-violet-500" />
                </td>
                <td className="py-4 px-4 text-center">
                  <FeatureValue value={feature.enterprise} gradient="from-amber-500 to-orange-500" />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function FeatureValue({ value, gradient }: { value: boolean | string; gradient: string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium">{value}</span>;
  }
  if (value) {
    return (
      <div className="inline-flex items-center justify-center">
        <div className={`p-1 rounded-full bg-gradient-to-r ${gradient}`}>
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center justify-center">
      <Minus className="w-4 h-4 text-muted-foreground/50" />
    </div>
  );
}

