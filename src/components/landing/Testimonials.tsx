"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "TogsTec AI transformed our customer support. We reduced response time by 80% and our customers love the instant, accurate answers.",
    name: "Sarah Chen",
    role: "CEO, TechFlow Solutions",
    avatar: "SC",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    quote: "The automation capabilities are incredible. We've saved over 40 hours per week on repetitive tasks and can now focus on what matters most.",
    name: "Michael Roberts",
    role: "Operations Director, HealthFirst Clinic",
    avatar: "MR",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    quote: "Implementation was seamless and the results were immediate. Our team productivity increased by 60% in just the first month.",
    name: "Emily Watson",
    role: "Founder, Wellness Hub",
    avatar: "EW",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    quote: "Best investment we've made for our business. The AI understands our customers perfectly and handles inquiries with a personal touch.",
    name: "David Park",
    role: "Manager, AutoCare Pro",
    avatar: "DP",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    quote: "The analytics and insights have helped us understand our customers better than ever. Game-changer for our growth strategy.",
    name: "Lisa Martinez",
    role: "COO, RetailEdge",
    avatar: "LM",
    gradient: "from-pink-500 to-rose-500",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Loved by{" "}
            </span>
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Businesses Worldwide
            </span>
          </h2>
        </motion.div>

        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-[300px] md:h-[250px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="h-full p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-background/50 dark:bg-background/30 border border-border/50 shadow-xl">
                  <Quote className="w-10 h-10 text-indigo-500/30 mb-4" />
                  <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed">
                    "{testimonials[current].quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[current].gradient} flex items-center justify-center text-white font-semibold`}>
                      {testimonials[current].avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonials[current].name}</div>
                      <div className="text-sm text-muted-foreground">{testimonials[current].role}</div>
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${testimonials[current].gradient} opacity-10 blur-xl -z-10`} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-8 bg-gradient-to-r from-indigo-500 to-violet-500"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

