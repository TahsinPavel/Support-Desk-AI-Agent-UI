"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { PricingToggle, PricingCard, ComparisonTable, FAQ, Testimonials, UsageBilling, type PricingTier } from "@/components/pricing";
// Declare Paddle type for TypeScript
declare global {
  interface Window {
    Paddle?: {
      Checkout: {
        open: (options: { items: { priceId: string; quantity: number }[]; customer?: { email: string } }) => void;
      };
    };
  }
  function Paddle(action: string, options: Record<string, unknown>): void;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter AI",
    description: "Perfect for small businesses getting started with AI automation",
    price: 149,
    yearlyPrice: 119,
    icon: "starter",
    popular: true,
    features: [
      "24/7 AI Call Answering (100 included minutes)",
      "24/7 AI Website Chatbot (unlimited)",
      "24/7 AI SMS Assistant (200 included SMS)",
      "24/7 AI Email Replies (unlimited)",
      "CRM Sync",
      "Appointment Scheduling",
      "Lead Capture Automation",
      "Basic Integrations",
      "1 Location",
    ],
    overages: [
      "Voice: $0.18/min",
      "SMS: $0.03/msg"
    ]
  },
  {
    name: "Growth AI",
    description: "For scaling teams needing advanced automation",
    price: null,
    yearlyPrice: null,
    priceLabel: "🚀 Launching Soon",
    icon: "growth",
    comingSoon: true,
    features: [
      "All Starter features",
      "500 included call minutes",
      "1000 included SMS",
      "Multi-location support",
      "Team Inbox",
      "Advanced Integrations",
      "Workflow Automations",
    ],
  },
  {
    name: "Enterprise AI",
    description: "For large organizations with complex requirements",
    price: null,
    yearlyPrice: null,
    priceLabel: "Custom",
    icon: "enterprise",
    enterprise: true,
    comingSoon: true,
    features: [
      "Everything in Growth",
      "Unlimited minutes option",
      "Priority Support",
      "Dedicated Success Manager",
      "Custom AI behavior tuning",
      "SLA",
    ],
  },
];// Price IDs for Paddle (replace with your actual price IDs)
const priceIds = {
  starter: { monthly: "pri_starter_monthly", yearly: "pri_starter_yearly" },
  growth: { monthly: "pri_growth_monthly", yearly: "pri_growth_yearly" },
};

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [userEmail] = useState(""); // Would come from auth context
  const router = useRouter();

  // Initialize Paddle
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => {
        if (window.Paddle) {
          // @ts-ignore
          window.Paddle.Environment.set("sandbox"); // Change to "production" for live
          // @ts-ignore
          window.Paddle.Setup({ 
            vendor: "YOUR_PADDLE_VENDOR_ID" // Replace with your vendor ID
          });
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleCheckout = (tier: PricingTier) => {
    if (tier.enterprise) {
      router.push("/contact-sales");
      return;
    }

    if (tier.comingSoon) {
      // Do nothing for coming soon plans
      return;
    }

    // Redirect to signup for the Starter plan
    router.push("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
          <motion.div
            className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-500">Simple, transparent pricing</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Never Miss a Lead Again with{" "}
                </span>
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  24/7 AI Agents
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Automate customer support, qualify leads, and boost conversions with our all-in-one AI platform. Start free, scale as you grow.
              </p>
              <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
            </motion.div>
          </div>
        </section>
        {/* Pricing Cards Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <PricingCard
                  key={tier.name}
                  tier={tier}
                  isYearly={isYearly}
                  onCheckout={() => handleCheckout(tier)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Compare Plans
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find the perfect plan for your business needs
              </p>
            </motion.div>
            <div className="max-w-5xl mx-auto rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
              <ComparisonTable />
            </div>
          </div>
        </section>        {/* FAQ Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about TogsTec AI
              </p>
            </motion.div>
            <FAQ />
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Usage Billing Section */}
        <UsageBilling />

        {/* Bottom CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <motion.div
            className="absolute top-0 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Automating Your Support Today
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10">
                Join thousands of businesses delivering instant, intelligent customer service with our AI platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="text-base px-8 py-6 bg-white text-indigo-600 hover:bg-white/90 shadow-xl"
                >
                  <a href="/auth/signup">
                    Start for $149/month
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-base px-8 py-6 bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  <a href="/contact-sales">Talk to Sales</a>
                </Button>
              </div>
              <p className="mt-6 text-white/60 text-sm">
                No credit card required · 14-day free trial
              </p>
            </motion.div>
          </div>
        </section>      </main>
      <Footer />
    </div>
  );
}

