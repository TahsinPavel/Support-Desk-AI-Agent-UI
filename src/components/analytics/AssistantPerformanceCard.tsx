import { motion } from "framer-motion";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { AssistantPerformance } from "@/types/analytics";

interface AssistantPerformanceCardProps {
  data: AssistantPerformance;
  isLoading?: boolean;
}

export function AssistantPerformanceCard({ data, isLoading = false }: AssistantPerformanceCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl shadow-sm h-full">
          <CardHeader>
            <CardTitle>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div className="flex justify-between mb-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const isPositive = data.changePercentage >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-2xl shadow-sm h-full">
        <CardHeader>
          <CardTitle>AI Assistant Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm font-medium">{data.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${data.completionRate}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Successful Resolutions</span>
              <span className="text-sm font-medium">{data.successfulResolutions}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${data.successfulResolutions}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Avg Handling Time</span>
              <span className="text-sm font-medium">{data.avgHandleTime}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
          <div className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Efficiency Score</span>
              <span className="text-2xl font-bold text-green-600">{data.efficiencyScore}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                style={{ width: `${data.efficiencyScore * 10}%` }}
              ></div>
            </div>
            <p className={`text-xs mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "↑" : "↓"} {Math.abs(data.changePercentage)}% from last period
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}