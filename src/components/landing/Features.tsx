"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  MessageSquareMore, 
  GitBranch, 
  BarChart3, 
  Brain, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Intelligent Automation",
    description: "Automate repetitive tasks with AI that learns and adapts to your business processes.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: MessageSquareMore,
    title: "Unified Communication Hub",
    description: "Manage SMS, email, voice, and chat from a single, intuitive dashboard.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: GitBranch,
    title: "Smart Workflow Routing",
    description: "Intelligently route conversations to the right team or AI agent based on context.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track performance, identify trends, and optimize with actionable insights.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Brain,
    title: "Personalized AI Responses",
    description: "Craft AI responses that match your brand voice and customer expectations.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Secure & Reliable Infrastructure",
    description: "Enterprise-grade security with 99.9% uptime and end-to-end encryption.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
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
              Powerful AI Tools to Elevate{" "}
            </span>
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Every Part of Your Business
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built to automate communication, reduce workload, and unlock new levels of efficiency.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-background/50 dark:bg-background/30 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                  {/* Subtle border glow */}
                  <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-sm -z-10 transition-opacity duration-300`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

