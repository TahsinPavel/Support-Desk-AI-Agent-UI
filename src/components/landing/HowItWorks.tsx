"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link2, Settings, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Connect Your Channels",
    description: "Link SMS, email, voice & chat instantly. Our seamless integrations get you up and running in minutes.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Settings,
    title: "Customize Your AI",
    description: "Set tone, greetings, and business rules. Train your AI to respond exactly how you want.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Automate Everything",
    description: "AI handles communication while you focus on growth. Scale effortlessly with intelligent automation.",
    gradient: "from-emerald-500 to-green-500",
  },
];

export function HowItWorks() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              Automate More.
            </span>{" "}
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Manage Less. Grow Faster.
            </span>
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block" />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-violet-500 to-emerald-500 origin-top hidden lg:block"
          />

          {/* Steps */}
          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="inline-block p-8 rounded-2xl backdrop-blur-xl bg-background/50 dark:bg-background/30 border border-border/50 shadow-lg">
                      <div className={`flex items-center gap-4 mb-4 ${isEven ? "lg:justify-end" : ""}`}>
                        <span className={`text-4xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                          {step.number}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground max-w-md">{step.description}</p>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.gradient} blur-xl opacity-50`} />
                  </motion.div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

