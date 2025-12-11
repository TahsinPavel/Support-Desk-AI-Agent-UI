"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do overages work?",
    answer: "Overages are billed at the end of each billing cycle. Voice calls are charged at $0.18 per minute and SMS messages at $0.03 per message. You'll only be charged for usage beyond your plan's included limits."
  },
  {
    question: "What happens if I reach my included minutes?",
    answer: "Your service continues uninterrupted. You'll be charged for overages at the standard rates ($0.18/min for voice, $0.03/msg for SMS) which will appear on your next bill."
  },
  {
    question: "Can I upgrade later?",
    answer: "Yes, you can upgrade to a higher plan at any time. Upgrades take effect immediately, and you'll get access to additional features and higher usage limits right away."
  },
  {
    question: "Is there a contract?",
    answer: "No, our Starter plan is month-to-month with no long-term commitment. You can cancel anytime. Enterprise plans may include custom contracts for additional features and support."
  },
  {
    question: "Will Growth/Enterprise be available soon?",
    answer: "Yes! We're actively developing the Growth and Enterprise plans with advanced features. Sign up for our newsletter to be notified when they become available."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      <div className="space-y-3 md:space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium pr-2 md:pr-4 text-sm md:text-base">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-4 md:px-5 pb-4 md:pb-5 text-muted-foreground text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

