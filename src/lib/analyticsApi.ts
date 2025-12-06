import axiosInstance from "./axiosInstance";
import { BasicAnalyticsData } from "@/types/analytics";
import { ANALYTICS_ENDPOINTS } from "@/lib/api";

/**
 * Fetch basic analytics data from the backend
 * GET /api/analytics/basic
 */
export async function getBasicAnalytics(): Promise<BasicAnalyticsData> {
  const response = await axiosInstance.get<BasicAnalyticsData>(ANALYTICS_ENDPOINTS.BASIC);
  return response.data;
}

/**
 * Analytics API endpoints
 */
export const ANALYTICS_API = {
  BASIC: "/analytics/basic",
} as const;