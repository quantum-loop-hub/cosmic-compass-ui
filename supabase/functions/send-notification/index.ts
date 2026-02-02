import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid notification types
const VALID_NOTIFICATION_TYPES = ['consultation_booked', 'order_status_changed'] as const;
type NotificationType = typeof VALID_NOTIFICATION_TYPES[number];

// Valid order statuses
const VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

interface NotificationRequest {
  type: NotificationType;
  email: string;
  data: {
    userName?: string;
    consultationDate?: string;
    consultationTime?: string;
    orderNumber?: string;
    orderStatus?: string;
    items?: string[];
  };
}

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize string to prevent XSS in HTML emails
function sanitizeString(str: string | undefined, maxLength: number = 200): string {
  if (!str) return '';
  return str
    .slice(0, maxLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('JWT validation failed:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Notification request from authenticated user: ${userId}`);

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(RESEND_API_KEY);
    
    // Parse and validate request body
    let requestBody: NotificationRequest;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, email, data } = requestBody;

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate notification type
    if (!type || !VALID_NOTIFICATION_TYPES.includes(type as NotificationType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid notification type. Must be: consultation_booked or order_status_changed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate data object exists
    if (!data || typeof data !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Data object is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Type-specific validation
    if (type === 'consultation_booked') {
      if (!data.consultationDate || typeof data.consultationDate !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Consultation date is required for consultation_booked notification' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (type === 'order_status_changed') {
      if (!data.orderNumber || typeof data.orderNumber !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Order number is required for order_status_changed notification' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (data.orderStatus && !VALID_ORDER_STATUSES.includes(data.orderStatus as typeof VALID_ORDER_STATUSES[number])) {
        return new Response(
          JSON.stringify({ error: 'Invalid order status. Must be: pending, processing, shipped, delivered, or cancelled' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate items array if present
    if (data.items !== undefined) {
      if (!Array.isArray(data.items) || data.items.length > 50) {
        return new Response(
          JSON.stringify({ error: 'Items must be an array with maximum 50 items' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (!data.items.every(item => typeof item === 'string' && item.length <= 200)) {
        return new Response(
          JSON.stringify({ error: 'Each item must be a string with maximum 200 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Sanitize all user-provided data for HTML output
    const sanitizedData = {
      userName: sanitizeString(data.userName, 100),
      consultationDate: sanitizeString(data.consultationDate, 50),
      consultationTime: sanitizeString(data.consultationTime, 50),
      orderNumber: sanitizeString(data.orderNumber, 50),
      orderStatus: data.orderStatus || 'pending',
      items: data.items?.map(item => sanitizeString(item, 200)) || [],
    };

    let subject = '';
    let htmlContent = '';

    if (type === 'consultation_booked') {
      subject = '🙏 Consultation Booking Confirmed - Astro Vichar';
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; background: #0a0a0f; color: #e5e5e5; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 32px; border: 1px solid #d4af37; }
            .header { text-align: center; margin-bottom: 24px; }
            .header h1 { color: #d4af37; margin: 0; font-size: 28px; }
            .content { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 20px 0; }
            .detail { margin: 12px 0; padding: 12px; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border-left: 4px solid #d4af37; }
            .detail-label { color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
            .detail-value { color: #fff; font-size: 18px; font-weight: 600; }
            .footer { text-align: center; margin-top: 24px; color: #888; font-size: 14px; }
            .cta { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Consultation Confirmed!</h1>
            </div>
            <p>नमस्ते ${sanitizedData.userName || 'User'},</p>
            <p>Your consultation with Astro Vichar has been successfully booked.</p>
            <div class="content">
              <div class="detail">
                <div class="detail-label">Date</div>
                <div class="detail-value">📅 ${sanitizedData.consultationDate || 'To be confirmed'}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Time</div>
                <div class="detail-value">🕐 ${sanitizedData.consultationTime || 'To be confirmed'}</div>
              </div>
            </div>
            <p>You will receive a Google Meet link before your scheduled session.</p>
            <p>Please have your birth details ready for an accurate reading.</p>
            <div style="text-align: center;">
              <a href="https://cal.id/astro-vichar" class="cta">View Booking Details</a>
            </div>
            <div class="footer">
              <p>🙏 Thank you for choosing Astro Vichar</p>
              <p>Questions? Reply to this email or contact astrovichar8@gmail.com</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'order_status_changed') {
      const statusEmoji: Record<string, string> = {
        pending: '⏳',
        processing: '🔄',
        shipped: '🚚',
        delivered: '✅',
        cancelled: '❌',
      };
      
      const statusMessages: Record<string, string> = {
        pending: 'Your order is being reviewed.',
        processing: 'Your order is being prepared and will ship soon.',
        shipped: 'Your order is on its way! Track your package for updates.',
        delivered: 'Your order has been delivered. Enjoy your purchase!',
        cancelled: 'Your order has been cancelled. Contact us if you have questions.',
      };

      const status = sanitizedData.orderStatus;
      subject = `${statusEmoji[status] || '📦'} Order Update: ${sanitizedData.orderNumber}`;
      
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; background: #0a0a0f; color: #e5e5e5; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 32px; border: 1px solid #d4af37; }
            .header { text-align: center; margin-bottom: 24px; }
            .header h1 { color: #d4af37; margin: 0; font-size: 28px; }
            .status-badge { display: inline-block; background: rgba(212, 175, 55, 0.2); color: #d4af37; padding: 8px 16px; border-radius: 20px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
            .content { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 20px 0; }
            .order-number { font-size: 24px; color: #fff; font-weight: 700; margin: 16px 0; }
            .message { font-size: 16px; line-height: 1.6; }
            .items { margin-top: 20px; }
            .item { padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin: 8px 0; }
            .footer { text-align: center; margin-top: 24px; color: #888; font-size: 14px; }
            .cta { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Update</h1>
            </div>
            <div style="text-align: center;">
              <span class="status-badge">${statusEmoji[status] || '📦'} ${status}</span>
              <p class="order-number">Order #${sanitizedData.orderNumber}</p>
            </div>
            <div class="content">
              <p class="message">${statusMessages[status] || 'Your order status has been updated.'}</p>
              ${sanitizedData.items.length > 0 ? `
                <div class="items">
                  <p style="color: #888; margin-bottom: 8px;">Items in your order:</p>
                  ${sanitizedData.items.map(item => `<div class="item">💎 ${item}</div>`).join('')}
                </div>
              ` : ''}
            </div>
            <div style="text-align: center;">
              <a href="#" class="cta">Track Your Order</a>
            </div>
            <div class="footer">
              <p>Thank you for shopping with Astro Vichar Gemstones</p>
              <p>Questions? Contact astrovichar8@gmail.com</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    console.log(`Sending ${type} notification to ${trimmedEmail} for user ${userId}`);

    // Note: In production, replace 'onboarding@resend.dev' with your verified domain
    const { data: emailData, error } = await resend.emails.send({
      from: 'Astro Vichar <onboarding@resend.dev>',
      to: [trimmedEmail],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, id: emailData?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    console.error('Notification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
