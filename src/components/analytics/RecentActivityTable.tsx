import { motion } from "framer-motion";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MessageCircle,
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock
} from "lucide-react";
import { RecentActivity } from "@/types/analytics";

interface RecentActivityTableProps {
  data: RecentActivity[];
  isLoading?: boolean;
}

export function RecentActivityTable({ data, isLoading = false }: RecentActivityTableProps) {
  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle>
              <div className="h-6 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>
                    <div>
                      <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-24 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getTypeIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'voice':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'chat':
        return <MessageCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-neutral-800">
                  <th className="pb-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="pb-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="pb-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary</th>
                  <th className="pb-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="pb-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {safeData.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(activity.type)}
                        <span className="capitalize text-gray-700 dark:text-gray-300">{activity.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{activity.contact}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {activity.summary}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                      {formatTime(activity.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(activity.status)}
                        <span className="capitalize text-gray-700 dark:text-gray-300">{activity.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}