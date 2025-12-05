import axiosInstance from '@/lib/axiosInstance';
import {
  VoiceHistoryResponse,
  VoiceDetailResponse
} from '@/types/voice';

// Voice API functions
export async function fetchVoiceHistory(
  tenantId: string,
  channelId: string,
  page: number,
  pageSize: number = 20
): Promise<VoiceHistoryResponse> {
  try {
    const response = await axiosInstance.get('/voice/logs', {
      params: {
        tenant_id: tenantId,
        channel_id: channelId,
        page,
        page_size: pageSize,
      },
    });

    // Handle different response formats
    if (response.data?.items) {
      return response.data;
    }
    // If backend returns array directly
    if (Array.isArray(response.data)) {
      return { items: response.data, total: response.data.length };
    }
    return { items: [], total: 0 };
  } catch (error) {
    console.error('Error fetching voice history:', error);
    // Return empty data instead of throwing to prevent UI crashes
    return { items: [], total: 0 };
  }
}

export async function fetchVoiceDetail(id: string): Promise<VoiceDetailResponse> {
  try {
    const response = await axiosInstance.get(`/voice/logs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching voice detail:', error);
    throw new Error('Failed to fetch voice detail');
  }
}