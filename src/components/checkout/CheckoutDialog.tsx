import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CartItem } from '@/hooks/useGemstoneStore';
import { Package, Truck, CreditCard, MapPin, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  email: z.string().email('Enter a valid email'),
  addressLine1: z.string().min(5, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  landmark: z.string().max(100).optional(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().min(6, 'Enter valid pincode').max(10),
  addressType: z.enum(['home', 'office', 'other']),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  formatPrice: (price: number) => string;
  onOrderComplete: (orderNumber: string) => void;
  clearCart: () => void;
}

const CheckoutDialog = ({
  isOpen,
  onClose,
  cart,
  cartTotal,
  formatPrice,
  onOrderComplete,
  clearCart,
}: CheckoutDialogProps) => {
  const [step, setStep] = useState<'address' | 'review' | 'processing' | 'success'>('address');
  const [orderNumber, setOrderNumber] = useState('');
  const { user } = useAuth();

  const shippingCost = cartTotal >= 10000 ? 0 : 199;
  const taxAmount = Math.round(cartTotal * 0.03);
  const totalAmount = cartTotal + shippingCost + taxAmount;

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      addressType: 'home',
    },
  });

  const onSubmitAddress = (data: AddressFormData) => {
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    setStep('processing');

    try {
      const generatedOrderNumber = `ORD${Date.now().toString(36).toUpperCase()}`;
      const addressData = form.getValues();

      const orderItems = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: generatedOrderNumber,
        items: orderItems,
        subtotal: cartTotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        payment_method: 'cod',
        payment_status: 'pending',
        order_status: 'confirmed',
        shipping_address: {
          fullName: addressData.fullName,
          phone: addressData.phone,
          email: addressData.email,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2 || '',
          landmark: addressData.landmark || '',
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          addressType: addressData.addressType,
        },
      });

      if (error) throw error;

      setOrderNumber(generatedOrderNumber);
      setStep('success');
      clearCart();
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
      setStep('review');
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onOrderComplete(orderNumber);
    }
    setStep('address');
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            {step === 'address' && <><MapPin className="w-5 h-5" /> Shipping Address</>}
            {step === 'review' && <><Package className="w-5 h-5" /> Review Order</>}
            {step === 'processing' && <><Truck className="w-5 h-5" /> Processing...</>}
            {step === 'success' && <><CheckCircle2 className="w-5 h-5 text-green-500" /> Order Placed!</>}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['address', 'review', 'success'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s || ['review', 'success'].indexOf(step) >= i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-1 ${
                    ['review', 'success'].indexOf(step) > i ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Address Form */}
        {step === 'address' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAddress)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1 *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="House/Flat No., Building Name, Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Area, Colony (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark</FormLabel>
                    <FormControl>
                      <Input placeholder="Near temple, opposite mall (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode *</FormLabel>
                      <FormControl>
                        <Input placeholder="400001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="addressType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Type *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home">Home</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="office" id="office" />
                          <Label htmlFor="office">Office</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Continue to Review
              </Button>
            </form>
          </Form>
        )}

        {/* Review Step */}
        {step === 'review' && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Order Summary</h3>
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (3%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{form.getValues('fullName')}</p>
                <p>{form.getValues('addressLine1')}</p>
                {form.getValues('addressLine2') && <p>{form.getValues('addressLine2')}</p>}
                {form.getValues('landmark') && <p>Landmark: {form.getValues('landmark')}</p>}
                <p>{form.getValues('city')}, {form.getValues('state')} - {form.getValues('pincode')}</p>
                <p>Phone: {form.getValues('phone')}</p>
                <p>Email: {form.getValues('email')}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Method
              </h3>
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/30">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('address')} className="flex-1">
                Edit Address
              </Button>
              <Button onClick={handlePlaceOrder} className="flex-1">
                Place Order
              </Button>
            </div>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Processing your order...</p>
            <p className="text-muted-foreground">Please wait while we confirm your order</p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Order Placed Successfully!</h3>
              <p className="text-muted-foreground">Thank you for your order</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold text-primary">{orderNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We've received your order and will contact you shortly. Pay {formatPrice(totalAmount)} when you receive your gemstones.
            </p>
            <Button onClick={handleClose} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
