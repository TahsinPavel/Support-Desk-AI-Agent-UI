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
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
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
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${iconColor}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}