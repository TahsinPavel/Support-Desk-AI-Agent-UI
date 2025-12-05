"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsCards } from "@/components/analytics/AnalyticsCards";
import { MessagesChart } from "@/components/analytics/MessagesChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RefreshCw,
  AlertCircle,
  BarChart3,
  Clock,
} from "lucide-react";

export default function AnalyticsPage() {
  const { data, loading, error, computedMetrics, refresh, isRefreshing } = useAnalytics();
  const [mounted, setMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track last updated time
  useEffect(() => {
    if (data && !loading) {
      setLastUpdated(new Date());
    }
  }, [data, loading]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Real-time insights into your support operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Last updated:</span>
              <span>{formatTime(lastUpdated)}</span>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <Card className="mb-6 bg-muted/50">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-muted-foreground">
              Auto-refreshing every 10 seconds
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={refresh}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="space-y-6 flex-1">
        {/* Metrics Cards */}
        <AnalyticsCards
          data={data}
          computedMetrics={computedMetrics}
          loading={loading}
        />

        {/* Messages Over Time Chart */}
        <MessagesChart
          data={data?.messages_over_time}
          loading={loading}
        />
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

