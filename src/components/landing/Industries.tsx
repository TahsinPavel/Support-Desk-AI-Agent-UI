"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Car, 
  Headphones 
} from "lucide-react";

const industries = [
  { icon: Briefcase, label: "Professional Services", gradient: "from-blue-500 to-indigo-500" },
  { icon: Heart, label: "Healthcare", gradient: "from-rose-500 to-pink-500" },
  { icon: ShoppingBag, label: "Retail", gradient: "from-amber-500 to-orange-500" },
  { icon: Sparkles, label: "Wellness", gradient: "from-violet-500 to-purple-500" },
  { icon: Car, label: "Automotive", gradient: "from-emerald-500 to-green-500" },
  { icon: Headphones, label: "Support Teams", gradient: "from-cyan-500 to-blue-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Industries() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

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
              Built for Every Business,{" "}
            </span>
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Any Size
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TogsTec AI adapts to your workflow, no matter the industry.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.label}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  className="flex flex-col items-center p-6 rounded-2xl backdrop-blur-xl bg-background/50 dark:bg-background/30 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${industry.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">{industry.label}</span>
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

