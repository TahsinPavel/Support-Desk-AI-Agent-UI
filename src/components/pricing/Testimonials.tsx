"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Customer Success Director",
    company: "TechFlow Inc.",
    content: "TogsTec AI has transformed our support operations. We've reduced response times by 85% and increased customer satisfaction scores by 40%.",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Operations Manager",
    company: "GrowthLabs",
    content: "The AI agents handle 70% of our inquiries automatically. This has freed up our team to focus on strategic initiatives rather than repetitive tasks.",
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Founder & CEO",
    company: "Bloom Studios",
    content: "Implementing TogsTec was seamless. Our customers love the 24/7 availability, and our team appreciates the intelligent escalation system.",
    avatar: "ER"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Trusted by Innovative Teams
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl md:max-w-2xl mx-auto">
            Join thousands of businesses transforming their customer support with AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 md:p-6 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-6 h-6 md:w-8 md:h-8 text-primary/20 mb-3 md:mb-4" />
              <p className="text-muted-foreground mb-5 md:mb-6 text-sm md:text-base italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm md:text-base mr-3 md:mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base">{testimonial.name}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
