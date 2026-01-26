import { useCallback } from 'react';
import { toast } from 'sonner';

interface ConsultationData {
  userName?: string;
  email: string;
  consultationDate?: string;
  consultationTime?: string;
}

interface OrderData {
  email: string;
  orderNumber: string;
  orderStatus: string;
  items?: string[];
}

export const useNotifications = () => {
  const sendConsultationNotification = useCallback(async (data: ConsultationData) => {
    try {
      const response = await fetch(
        'https://enlxxeyzthcphnettkeu.supabase.co/functions/v1/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'consultation_booked',
            email: data.email,
            data: {
              userName: data.userName,
              consultationDate: data.consultationDate,
              consultationTime: data.consultationTime,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      toast.success('Confirmation email sent!');
      return true;
    } catch (error) {
      console.error('Notification error:', error);
      toast.error('Failed to send confirmation email');
      return false;
    }
  }, []);

  const sendOrderStatusNotification = useCallback(async (data: OrderData) => {
    try {
      const response = await fetch(
        'https://enlxxeyzthcphnettkeu.supabase.co/functions/v1/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'order_status_changed',
            email: data.email,
            data: {
              orderNumber: data.orderNumber,
              orderStatus: data.orderStatus,
              items: data.items,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      toast.success('Order update email sent!');
      return true;
    } catch (error) {
      console.error('Notification error:', error);
      toast.error('Failed to send order update email');
      return false;
    }
  }, []);

  return {
    sendConsultationNotification,
    sendOrderStatusNotification,
  };
};
