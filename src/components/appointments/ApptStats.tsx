"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ComputedAppointmentStats, DayCount } from "@/types/appointments";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface ApptStatsProps {
  stats: ComputedAppointmentStats;
  loading: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export function ApptStats({ stats, loading }: ApptStatsProps) {
  if (loading) {
    return <ApptStatsSkeleton />;
  }

  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: <CalendarDays className="h-5 w-5 text-blue-500" />,
      bgColor: "bg-blue-500/10",
      color: "text-blue-500",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: <CalendarCheck className="h-5 w-5 text-green-500" />,
      bgColor: "bg-green-500/10",
      color: "text-green-500",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      bgColor: "bg-amber-500/10",
      color: "text-amber-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircle className="h-5 w-5 text-purple-500" />,
      bgColor: "bg-purple-500/10",
      color: "text-purple-500",
    },
    {
      title: "Canceled",
      value: stats.canceled,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      bgColor: "bg-red-500/10",
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>{card.icon}</div>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <MiniSparkline data={stats.byDay} color={card.color} />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function MiniSparkline({ data, color }: { data: DayCount[]; color: string }) {
  if (!data || !data.length) return null;
  const strokeColor = color.replace("text-", "").replace("-500", "");

  return (
    <div className="h-8 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-7)}>
          <Line
            type="monotone"
            dataKey="count"
            stroke={`hsl(var(--${strokeColor === "blue" ? "primary" : strokeColor}))`}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ApptStatsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

