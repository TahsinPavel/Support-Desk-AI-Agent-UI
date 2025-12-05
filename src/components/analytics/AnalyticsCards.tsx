"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicAnalyticsData, ComputedMetrics } from "@/types/analytics";
import {
  MessageSquare,
  Bot,
  AlertTriangle,
  TrendingUp,
  Mail,
  Phone,
  MessageCircle,
  Smartphone,
} from "lucide-react";

interface AnalyticsCardsProps {
  data: BasicAnalyticsData | null;
  computedMetrics: ComputedMetrics | null;
  loading: boolean;
}

export function AnalyticsCards({ data, computedMetrics, loading }: AnalyticsCardsProps) {
  if (loading && !data) {
    return <AnalyticsCardsSkeleton />;
  }

  const primaryMetrics = [
    {
      title: "Total Messages",
      value: data?.total_messages ?? 0,
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      bgColor: "bg-blue-500/10",
    },
    {
      title: "AI Resolved",
      value: data?.ai_resolved ?? 0,
      icon: <Bot className="h-5 w-5 text-green-500" />,
      bgColor: "bg-green-500/10",
    },
    {
      title: "Escalated",
      value: data?.escalated ?? 0,
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Resolution Rate",
      value: `${computedMetrics?.resolutionRate ?? 0}%`,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      bgColor: "bg-purple-500/10",
    },
  ];

  const channelMetrics = [
    {
      title: "SMS",
      value: data?.sms_count ?? 0,
      icon: <Smartphone className="h-5 w-5 text-cyan-500" />,
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Email",
      value: data?.email_count ?? 0,
      icon: <Mail className="h-5 w-5 text-rose-500" />,
      bgColor: "bg-rose-500/10",
    },
    {
      title: "Chat",
      value: data?.chat_count ?? 0,
      icon: <MessageCircle className="h-5 w-5 text-indigo-500" />,
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Voice",
      value: data?.voice_count ?? 0,
      icon: <Phone className="h-5 w-5 text-amber-500" />,
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Channel Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {channelMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
}

function MetricCard({ title, value, icon, bgColor }: MetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function AnalyticsCardsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

