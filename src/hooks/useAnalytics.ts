"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getBasicAnalytics } from "@/lib/analyticsApi";
import { BasicAnalyticsData, AnalyticsState, ComputedMetrics } from "@/types/analytics";

const REFRESH_INTERVAL = 10000; // 10 seconds

export function useAnalytics() {
  const router = useRouter();
  const [state, setState] = useState<AnalyticsState>({
    data: null,
    loading: true,
    error: null,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAnalytics = useCallback(async () => {
    // Check for auth token
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: prev.data === null, error: null }));
      const data = await getBasicAnalytics();
      setState({ data, loading: false, error: null });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch analytics data";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [router]);

  // Compute derived metrics
  const computedMetrics: ComputedMetrics | null = state.data
    ? {
        resolutionRate:
          state.data.total_messages > 0
            ? Math.round((state.data.ai_resolved / state.data.total_messages) * 100)
            : 0,
        totalChannelMessages:
          state.data.sms_count +
          state.data.email_count +
          state.data.chat_count +
          state.data.voice_count,
      }
    : null;

  // Initial fetch and interval setup
  useEffect(() => {
    fetchAnalytics();

    // Set up auto-refresh
    intervalRef.current = setInterval(() => {
      fetchAnalytics();
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAnalytics]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    ...state,
    computedMetrics,
    refresh,
    isRefreshing: state.loading && state.data !== null,
  };
}

