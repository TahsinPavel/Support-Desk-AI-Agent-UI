import axiosInstance from '@/lib/axiosInstance';
import {
  EmailMessage,
  SendEmailRequest
} from '@/types/email';
import { EMAIL_ENDPOINTS } from '@/lib/api';

/**
 * Fetch all emails from the inbox
 * GET /api/email/messages
 */
export async function getEmails(): Promise<EmailMessage[]> {
  try {
    const response = await axiosInstance.get(EMAIL_ENDPOINTS.LIST);

    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data?.items) {
      return response.data.items;
    }
    if (response.data?.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

/**
 * Send an email reply
 * POST /api/email/send
 */
export async function sendEmail(data: SendEmailRequest): Promise<void> {
  try {
    await axiosInstance.post(EMAIL_ENDPOINTS.SEND, data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}