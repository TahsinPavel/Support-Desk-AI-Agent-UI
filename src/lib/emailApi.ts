import axios from 'axios';
import { 
  EmailInboxResponse, 
  EmailThreadResponse, 
  SendEmailRequest 
} from '@/types/email';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Email API functions
export async function fetchInbox(
  tenantId: string, 
  channelId: string, 
  page: number,
  pageSize: number = 20
): Promise<EmailInboxResponse> {
  try {
    const response = await axiosInstance.get('/email/inbox', {
      params: {
        tenant_id: tenantId,
        channel_id: channelId,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching inbox:', error);
    throw new Error('Failed to fetch email inbox');
  }
}

export async function fetchThread(threadId: string): Promise<EmailThreadResponse> {
  try {
    const response = await axiosInstance.get(`/email/thread/${threadId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching thread:', error);
    throw new Error('Failed to fetch email thread');
  }
}

export async function sendEmail(data: SendEmailRequest): Promise<void> {
  try {
    await axiosInstance.post('/email/send', data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}