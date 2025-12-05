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
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
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
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-3 px-4">Type</th>
                  <th className="pb-3 px-4">Contact</th>
                  <th className="pb-3 px-4">Summary</th>
                  <th className="pb-3 px-4">Timestamp</th>
                  <th className="pb-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((activity) => (
                  <tr key={activity.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(activity.type)}
                        <span className="capitalize">{activity.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{activity.contact}</td>
                    <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                      {activity.summary}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {formatTime(activity.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(activity.status)}
                        <span className="capitalize">{activity.status}</span>
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