"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageSquare, Mail, Phone, MessageCircle } from "lucide-react";

const cards = [
  { icon: MessageSquare, label: "SMS", color: "from-blue-500 to-cyan-400", delay: 0 },
  { icon: Mail, label: "Email", color: "from-violet-500 to-purple-400", delay: 0.5 },
  { icon: Phone, label: "Voice", color: "from-emerald-500 to-green-400", delay: 1 },
  { icon: MessageCircle, label: "Chat", color: "from-orange-500 to-amber-400", delay: 1.5 },
];

export function FloatingCards() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/30 to-violet-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Glass Cards */}
      {cards.map((card, index) => {
        const Icon = card.icon;
        const positions = [
          { top: "15%", left: "10%", rotate: -12 },
          { top: "20%", right: "15%", rotate: 8 },
          { bottom: "25%", left: "15%", rotate: 6 },
          { bottom: "20%", right: "10%", rotate: -8 },
        ];
        const pos = positions[index];

        return (
          <motion.div
            key={card.label}
            className="absolute hidden md:block"
            style={{ ...pos, x, y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -20, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: card.delay },
              scale: { duration: 0.8, delay: card.delay },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: card.delay },
            }}
          >
            <div
              className={`relative p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 shadow-2xl`}
              style={{ transform: `rotate(${pos.rotate}deg)` }}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-20`} />
              <div className="relative flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-foreground">{card.label}</span>
              </div>
              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${card.color} opacity-20 blur-xl -z-10`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

