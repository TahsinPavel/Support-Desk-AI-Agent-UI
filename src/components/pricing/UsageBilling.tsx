"use client";

import { motion } from "framer-motion";

export function UsageBilling() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pay Only For What You Use
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This ensures transparent pricing while keeping your cost predictable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <span className="font-medium">Voice minutes</span>
              <span className="font-bold text-lg">$0.18/min</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <span className="font-medium">SMS messages</span>
              <span className="font-bold text-lg">$0.03/msg</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}