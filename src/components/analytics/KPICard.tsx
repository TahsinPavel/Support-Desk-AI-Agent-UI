import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor: string;
  isLoading?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  isLoading = false
}: KPICardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-7 w-20 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconColor}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <p className={`text-sm flex items-center gap-1 mt-1 ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            <span className="text-xs">{isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(change)}% from last period</span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}