 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { orderNumber } = await req.json();
 
     if (!orderNumber || typeof orderNumber !== 'string') {
       return new Response(
         JSON.stringify({ error: 'Order number is required' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Clean and validate order number format
     const cleanOrderNumber = orderNumber.trim().toUpperCase();
     if (!/^ORD[A-Z0-9]+$/.test(cleanOrderNumber)) {
       return new Response(
         JSON.stringify({ error: 'Invalid order number format' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const supabaseUrl = Deno.env.get('SUPABASE_URL');
     const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 
     if (!supabaseUrl || !supabaseServiceKey) {
       throw new Error('Supabase configuration missing');
     }
 
     // Use service role to bypass RLS for public order lookup
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     const { data: order, error } = await supabase
       .from('orders')
       .select('order_number, order_status, payment_status, items, total_amount, shipping_address, created_at, updated_at')
       .eq('order_number', cleanOrderNumber)
       .single();
 
     if (error || !order) {
       console.log('Order not found:', cleanOrderNumber);
       return new Response(
         JSON.stringify({ error: 'Order not found' }),
         { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Return only safe public information (mask sensitive data)
     const publicOrderInfo = {
       orderNumber: order.order_number,
       status: order.order_status,
       paymentStatus: order.payment_status,
       totalAmount: order.total_amount,
       items: (order.items as { name: string; quantity: number; price: number }[]).map(item => ({
         name: item.name,
         quantity: item.quantity,
         price: item.price,
       })),
       shippingCity: (order.shipping_address as { city?: string })?.city || 'N/A',
       orderDate: order.created_at,
       lastUpdated: order.updated_at,
     };
 
     console.log('Order found:', cleanOrderNumber, '- Status:', order.order_status);
 
     return new Response(
       JSON.stringify({ success: true, order: publicOrderInfo }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   } catch (error: unknown) {
     console.error('Get order status error:', error);
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     return new Response(
       JSON.stringify({ error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });