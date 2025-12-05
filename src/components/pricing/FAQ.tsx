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
    question: "How does the 7-day free trial work?",
    answer: "Start your free trial instantly — no credit card required. You'll get full access to all features in your selected plan. If you love it, simply add your payment details to continue after the trial ends."
  },
  {
    question: "What counts as an AI resolution?",
    answer: "An AI resolution is counted when our AI successfully handles a customer inquiry without needing human intervention. This includes answering questions, scheduling appointments, providing information, or completing tasks autonomously."
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at your next billing cycle."
  },
  {
    question: "What integrations are supported?",
    answer: "We integrate with popular CRMs like HubSpot, Salesforce, and Pipedrive. Knowledge bases can pull from PDF documents, Notion, websites, and Google Drive. We also support custom API integrations for Enterprise plans."
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We take security seriously. All data is encrypted in transit and at rest. Enterprise plans include HIPAA and SOC-2 compliance features, SSO authentication, and dedicated security controls."
  },
  {
    question: "How does the AI learn about my business?",
    answer: "You can train the AI using knowledge bases — upload documents, connect to Notion, or let it crawl your website. The AI learns your business context, terminology, and processes to provide accurate, personalized responses."
  },
  {
    question: "What happens if the AI can't answer a question?",
    answer: "When the AI encounters a complex query it can't handle, it seamlessly escalates to a human agent with full conversation context. You can also set custom escalation rules based on topics or keywords."
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Yes! Our Enterprise plan is fully customizable. Contact our sales team to discuss custom LLM selection, advanced security requirements, dedicated infrastructure, custom onboarding, and volume pricing."
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
      <div className="space-y-4">
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
              className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium pr-4">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
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
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
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

