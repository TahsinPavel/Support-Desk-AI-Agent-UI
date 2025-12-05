"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { 
  RefreshCw, 
  MessageSquare, 
  Mail, 
  Phone, 
  MessageCircle
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { fetcher } from "@/lib/api";
import { 
  SMS_ENDPOINTS, 
  EMAIL_ENDPOINTS, 
  VOICE_ENDPOINTS, 
  CHAT_ENDPOINTS, 
  ANALYTICS_ENDPOINTS 
} from "@/lib/api";
import { 
  SMSSummary, 
  EmailSummary, 
  VoiceSummary, 
  ChatSummary,
  DailyActivity,
  MessageTypeDistribution,
  RecentActivity,
  AssistantPerformance
} from "@/types/analytics";
import { KPICard } from "@/components/analytics/KPICard";
import { LineChartCard } from "@/components/analytics/LineChartCard";
import { BarChartCard } from "@/components/analytics/BarChartCard";
import { PieChartCard } from "@/components/analytics/PieChartCard";
import { AssistantPerformanceCard } from "@/components/analytics/AssistantPerformanceCard";
import { RecentActivityTable } from "@/components/analytics/RecentActivityTable";

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("7");
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Fetch all summary data
  const { data: smsSummary, isLoading: smsLoading, error: smsError, mutate: mutateSms } = useSWR<SMSSummary>(
    SMS_ENDPOINTS.SUMMARY, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: emailSummary, isLoading: emailLoading, error: emailError, mutate: mutateEmail } = useSWR<EmailSummary>(
    EMAIL_ENDPOINTS.SUMMARY, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: voiceSummary, isLoading: voiceLoading, error: voiceError, mutate: mutateVoice } = useSWR<VoiceSummary>(
    VOICE_ENDPOINTS.SUMMARY, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: chatSummary, isLoading: chatLoading, error: chatError, mutate: mutateChat } = useSWR<ChatSummary>(
    CHAT_ENDPOINTS.SUMMARY, 
    fetcher, 
    { refreshInterval: 5000 }
  );

  // Fetch daily data for charts
  const { data: smsDaily, isLoading: smsDailyLoading } = useSWR<any[]>(
    SMS_ENDPOINTS.DAILY, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: emailDaily, isLoading: emailDailyLoading } = useSWR<any[]>(
    EMAIL_ENDPOINTS.DAILY, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: voiceDaily, isLoading: voiceDailyLoading } = useSWR<any[]>(
    VOICE_ENDPOINTS.DAILY, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: chatDaily, isLoading: chatDailyLoading } = useSWR<any[]>(
    CHAT_ENDPOINTS.DAILY, 
    fetcher, 
    { refreshInterval: 5000 }
  );

  // Fetch type distributions
  const { data: smsTypes, isLoading: smsTypesLoading } = useSWR<any[]>(
    SMS_ENDPOINTS.TYPES, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: emailTypes, isLoading: emailTypesLoading } = useSWR<any[]>(
    EMAIL_ENDPOINTS.TYPES, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: voiceTypes, isLoading: voiceTypesLoading } = useSWR<any[]>(
    VOICE_ENDPOINTS.TYPES, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: chatTypes, isLoading: chatTypesLoading } = useSWR<any[]>(
    CHAT_ENDPOINTS.TYPES, 
    fetcher, 
    { refreshInterval: 5000 }
  );

  // Fetch unified data
  const { data: recentActivity, isLoading: recentActivityLoading, error: recentActivityError, mutate: mutateRecentActivity } = useSWR<RecentActivity[]>(
    ANALYTICS_ENDPOINTS.RECENT_ACTIVITY, 
    fetcher, 
    { refreshInterval: 5000 }
  );
  
  const { data: assistantPerformance, isLoading: assistantPerformanceLoading, error: assistantPerformanceError, mutate: mutateAssistantPerformance } = useSWR<AssistantPerformance>(
    ANALYTICS_ENDPOINTS.ASSISTANT_PERFORMANCE, 
    fetcher, 
    { refreshInterval: 5000 }
  );

  // Helper function to ensure data is an array
  const ensureArray = (data: unknown): any[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return [];
  };

  // Combine daily data for line chart
  const combineDailyData = (): DailyActivity[] => {
    const smsArr = ensureArray(smsDaily);
    const emailArr = ensureArray(emailDaily);
    const voiceArr = ensureArray(voiceDaily);
    const chatArr = ensureArray(chatDaily);

    if (smsArr.length === 0) return [];

    return smsArr.map((smsItem, index) => ({
      date: smsItem?.date || '',
      sms: smsItem?.count || 0,
      email: emailArr[index]?.count || 0,
      voice: voiceArr[index]?.count || 0,
      chat: chatArr[index]?.count || 0
    }));
  };

  const dailyActivityData = combineDailyData();

  // Combine type distributions for pie chart
  const combineTypeData = (): MessageTypeDistribution[] => {
    const smsArr = ensureArray(smsTypes);
    const emailArr = ensureArray(emailTypes);
    const voiceArr = ensureArray(voiceTypes);
    const chatArr = ensureArray(chatTypes);

    const allTypes = [
      ...smsArr.map((item: any) => ({ ...item, type: `SMS - ${item?.type || 'Unknown'}` })),
      ...emailArr.map((item: any) => ({ ...item, type: `Email - ${item?.type || 'Unknown'}` })),
      ...voiceArr.map((item: any) => ({ ...item, type: `Voice - ${item?.type || 'Unknown'}` })),
      ...chatArr.map((item: any) => ({ ...item, type: `Chat - ${item?.type || 'Unknown'}` }))
    ];

    const totalCount = allTypes.reduce((sum, item) => sum + (item?.count || 0), 0);

    return allTypes.map(item => ({
      ...item,
      percentage: totalCount > 0 ? Math.round(((item?.count || 0) / totalCount) * 100) : 0
    }));
  };

  const messageTypeData = combineTypeData();

  // Handle manual refresh
  const handleRefresh = () => {
    mutateSms();
    mutateEmail();
    mutateVoice();
    mutateChat();
    mutateRecentActivity();
    mutateAssistantPerformance();
    setRefreshIndex(prev => prev + 1);
  };

  // KPI Card data
  const kpiData = [
    {
      title: "SMS Messages",
      value: (smsSummary?.totalMessages ?? 0).toString(),
      change: smsSummary?.changePercentage ?? 0,
      icon: MessageSquare,
      iconColor: "bg-blue-500",
      isLoading: smsLoading
    },
    {
      title: "Emails",
      value: (emailSummary?.totalEmails ?? 0).toString(),
      change: emailSummary?.changePercentage ?? 0,
      icon: Mail,
      iconColor: "bg-purple-500",
      isLoading: emailLoading
    },
    {
      title: "Voice Calls",
      value: (voiceSummary?.totalCalls ?? 0).toString(),
      change: voiceSummary?.changePercentage ?? 0,
      icon: Phone,
      iconColor: "bg-green-500",
      isLoading: voiceLoading
    },
    {
      title: "Chat Sessions",
      value: (chatSummary?.totalChats ?? 0).toString(),
      change: chatSummary?.changePercentage ?? 0,
      icon: MessageCircle,
      iconColor: "bg-yellow-500",
      isLoading: chatLoading
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      key={refreshIndex}
    >
      {/* Section 1: Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time overview of your communication metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} className="border-gray-200 dark:border-neutral-700">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Section 2: KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              iconColor={kpi.iconColor}
              isLoading={kpi.isLoading}
            />
          ))}
        </div>
      </motion.div>

      {/* Section 3: Line Chart */}
      <LineChartCard 
        data={dailyActivityData} 
        isLoading={smsDailyLoading || emailDailyLoading || voiceDailyLoading || chatDailyLoading} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 4: Bar Chart */}
        <BarChartCard 
          data={dailyActivityData} 
          isLoading={smsDailyLoading || voiceDailyLoading} 
        />

        {/* Section 5: Pie Chart */}
        <PieChartCard 
          data={messageTypeData} 
          isLoading={smsTypesLoading || emailTypesLoading || voiceTypesLoading || chatTypesLoading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 6: AI Assistant Performance */}
        <AssistantPerformanceCard 
          data={assistantPerformance || {
            completionRate: 0,
            successfulResolutions: 0,
            avgHandleTime: "0m",
            efficiencyScore: 0,
            changePercentage: 0
          }} 
          isLoading={assistantPerformanceLoading} 
        />

        {/* Section 7: Recent Activity Table */}
        <div className="lg:col-span-2">
          <RecentActivityTable 
            data={recentActivity || []} 
            isLoading={recentActivityLoading} 
          />
        </div>
      </div>
    </motion.div>
  );
}