"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DayCount } from "@/types/appointments";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, parseISO } from "date-fns";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ApptChartProps {
  data: DayCount[];
  loading: boolean;
}

export function ApptChart({ data, loading }: ApptChartProps) {
  if (loading) {
    return <ApptChartSkeleton />;
  }

  // Handle undefined or empty data
  const safeData = data || [];

  // Format data for the chart
  const chartData = safeData.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
  }));

  // Calculate total for the period
  const total = safeData.reduce((sum, item) => sum + item.count, 0);
  const average = safeData.length > 0 ? Math.round(total / safeData.length) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Appointments Over Time
              </CardTitle>
              <CardDescription>
                Daily appointment volume trend
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{total.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {average}/day avg
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No data available for selected range
            </div>
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="appointmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#appointmentGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
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
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  let formattedFullDate = data.date;
  try {
    formattedFullDate = format(parseISO(data.date), "MMMM d, yyyy");
  } catch { /* use original */ }

  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium">{formattedFullDate}</p>
      <p className="text-sm text-muted-foreground">
        Appointments: <span className="font-semibold text-foreground">{data.count}</span>
      </p>
    </div>
  );
}

function ApptChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-8 w-16 ml-auto" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}
