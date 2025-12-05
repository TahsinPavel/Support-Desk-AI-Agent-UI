import axiosInstance from "./axiosInstance";
import { BasicAnalyticsData } from "@/types/analytics";

/**
 * Fetch basic analytics data from the backend
 * GET /analytics/basic
 */
export async function getBasicAnalytics(): Promise<BasicAnalyticsData> {
  const response = await axiosInstance.get<BasicAnalyticsData>("/analytics/basic");
  return response.data;
}

/**
 * Analytics API endpoints
 */
export const ANALYTICS_API = {
  BASIC: "/analytics/basic",
} as const;

