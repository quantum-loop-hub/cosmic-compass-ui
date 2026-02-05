 import { useState } from 'react';
 import { useSearchParams } from 'react-router-dom';
 import { useForm } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { z } from 'zod';
 import Layout from '@/components/layout/Layout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
 } from '@/components/ui/form';
import OrderTimeline from '@/components/checkout/OrderTimeline';
import type { OrderStatus } from '@/components/checkout/OrderTimeline';
 import { supabase } from '@/integrations/supabase/client';
 import { Package, Search, MapPin, Calendar, IndianRupee, AlertCircle } from 'lucide-react';
 import { toast } from 'sonner';
 
 const searchSchema = z.object({
   orderNumber: z.string().min(1, 'Order number is required'),
 });
 
 type SearchFormData = z.infer<typeof searchSchema>;
 
 interface OrderItem {
   name: string;
   quantity: number;
   price: number;
 }
 
 interface OrderInfo {
   orderNumber: string;
  status: OrderStatus;
   paymentStatus: string;
   totalAmount: number;
   items: OrderItem[];
   shippingCity: string;
   orderDate: string;
   lastUpdated: string;
 }
 
 const TrackOrder = () => {
   const [searchParams] = useSearchParams();
   const [order, setOrder] = useState<OrderInfo | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [notFound, setNotFound] = useState(false);
 
   const form = useForm<SearchFormData>({
     resolver: zodResolver(searchSchema),
     defaultValues: {
       orderNumber: searchParams.get('order') || '',
     },
   });
 
   const formatPrice = (price: number) => {
     return new Intl.NumberFormat('en-IN', {
       style: 'currency',
       currency: 'INR',
       maximumFractionDigits: 0,
     }).format(price);
   };
 
   const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-IN', {
       day: 'numeric',
       month: 'short',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   const onSubmit = async (data: SearchFormData) => {
     setIsLoading(true);
     setNotFound(false);
     setOrder(null);
 
     try {
       const { data: result, error } = await supabase.functions.invoke('get-order-status', {
         body: { orderNumber: data.orderNumber },
       });
 
       if (error) {
         throw new Error(error.message);
       }
 
       if (result.error) {
         if (result.error === 'Order not found') {
           setNotFound(true);
         } else {
           toast.error(result.error);
         }
         return;
       }
 
       setOrder(result.order);
     } catch (error) {
       console.error('Track order error:', error);
       toast.error('Failed to track order. Please try again.');
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <Layout>
       <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
         <div className="container max-w-2xl mx-auto px-4">
           <div className="text-center mb-8">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package className="w-8 h-8 text-primary" />
             </div>
             <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
             <p className="text-muted-foreground">
               Enter your order number to check the delivery status
             </p>
           </div>
 
           <Card className="mb-8">
             <CardContent className="pt-6">
               <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
                   <FormField
                     control={form.control}
                     name="orderNumber"
                     render={({ field }) => (
                       <FormItem className="flex-1">
                         <FormControl>
                           <Input
                             placeholder="Enter Order Number (e.g., ORDML944XUZ)"
                             {...field}
                             className="text-lg"
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <Button type="submit" disabled={isLoading} className="px-6">
                     {isLoading ? (
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <>
                         <Search className="w-4 h-4 mr-2" />
                         Track
                       </>
                     )}
                   </Button>
                 </form>
               </Form>
             </CardContent>
           </Card>
 
           {notFound && (
             <Card className="border-destructive/50 bg-destructive/5">
               <CardContent className="pt-6">
                 <div className="flex items-center gap-3 text-destructive">
                   <AlertCircle className="w-6 h-6" />
                   <div>
                     <p className="font-semibold">Order Not Found</p>
                     <p className="text-sm text-muted-foreground">
                       Please check the order number and try again.
                     </p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           )}
 
           {order && (
             <div className="space-y-6">
               {/* Order Status Card */}
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     <span className="text-primary">Order #{order.orderNumber}</span>
                     <span className={`text-sm px-3 py-1 rounded-full ${
                       order.paymentStatus === 'paid' 
                         ? 'bg-green-100 text-green-700' 
                         : 'bg-amber-100 text-amber-700'
                     }`}>
                       {order.paymentStatus === 'pending' ? '💵 COD' : '✅ Paid'}
                     </span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <OrderTimeline currentStatus={order.status} />
                 </CardContent>
               </Card>
 
               {/* Order Details */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg">Order Details</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   {/* Items */}
                   <div className="space-y-2">
                     {order.items.map((item, index) => (
                       <div key={index} className="flex justify-between text-sm bg-muted/50 p-3 rounded-lg">
                         <span className="flex items-center gap-2">
                           <span>💎</span>
                           <span>{item.name}</span>
                           <span className="text-muted-foreground">× {item.quantity}</span>
                         </span>
                         <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                       </div>
                     ))}
                   </div>
 
                   <div className="border-t pt-4 space-y-2">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <IndianRupee className="w-4 h-4" />
                       <span>Total Amount:</span>
                       <span className="font-bold text-foreground text-lg">{formatPrice(order.totalAmount)}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <MapPin className="w-4 h-4" />
                       <span>Shipping to:</span>
                       <span className="text-foreground">{order.shippingCity}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Calendar className="w-4 h-4" />
                       <span>Ordered on:</span>
                       <span className="text-foreground">{formatDate(order.orderDate)}</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
 
               {/* Help Section */}
               <div className="text-center text-sm text-muted-foreground">
                 <p>Need help? Contact us at <a href="mailto:astrovichar8@gmail.com" className="text-primary hover:underline">astrovichar8@gmail.com</a></p>
               </div>
             </div>
           )}
         </div>
       </div>
     </Layout>
   );
 };
 
 export default TrackOrder;