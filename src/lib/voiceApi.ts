import axios from 'axios';
import { 
  VoiceHistoryResponse, 
  VoiceDetailResponse 
} from '@/types/voice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Voice API functions
export async function fetchVoiceHistory(
  tenantId: string, 
  channelId: string, 
  page: number,
  pageSize: number = 20
): Promise<VoiceHistoryResponse> {
  try {
    const response = await axiosInstance.get('/voice/history', {
      params: {
        tenant_id: tenantId,
        channel_id: channelId,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching voice history:', error);
    throw new Error('Failed to fetch voice history');
  }
}

export async function fetchVoiceDetail(id: string): Promise<VoiceDetailResponse> {
  try {
    const response = await axiosInstance.get(`/voice/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching voice detail:', error);
    throw new Error('Failed to fetch voice detail');
  }
}