"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageOverTime } from "@/types/analytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { TrendingUp } from "lucide-react";

interface MessagesChartProps {
  data: MessageOverTime[] | undefined;
  loading: boolean;
}

export function MessagesChart({ data, loading }: MessagesChartProps) {
  if (loading && !data) {
    return <MessagesChartSkeleton />;
  }

  // Format data for the chart
  const chartData = data?.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
  })) ?? [];

  // Calculate total for the period
  const totalMessages = data?.reduce((sum, item) => sum + item.count, 0) ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Messages Over Time
            </CardTitle>
            <CardDescription>
              Daily message volume for the selected period
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalMessages.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Messages</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMM d");
  } catch {
    return dateString;
  }
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { date: string; count: number } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  let formattedFullDate = data.date;
  try {
    formattedFullDate = format(parseISO(data.date), "MMMM d, yyyy");
  } catch {
    // Use original date if parsing fails
  }

  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium">{formattedFullDate}</p>
      <p className="text-sm text-muted-foreground">
        Messages: <span className="font-semibold text-foreground">{data.count}</span>
      </p>
    </div>
  );
}

function MessagesChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-8 w-16 ml-auto" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

