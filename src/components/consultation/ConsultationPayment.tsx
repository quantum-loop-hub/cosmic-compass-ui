import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { generateConsultationReceipt } from '@/utils/generateReceipt';
import { format } from 'date-fns';

const PRESET_AMOUNTS = [500, 1100, 2100, 5100];

const ConsultationPayment: React.FC = () => {
  const [amount, setAmount] = useState<number>(1100);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [paymentDetails, setPaymentDetails] = useState<{
    payment_id: string;
    order_id: string;
    amount: number;
  } | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const activeAmount = customAmount ? Number(customAmount) : amount;

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
  };

  const initiatePayment = async () => {
    if (!user) {
      toast.error('कृपया पहले लॉगिन करें / Please login first', {
        action: { label: 'Login', onClick: () => navigate('/auth') },
      });
      return;
    }

    if (!activeAmount || activeAmount < 1) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      // 1. Create Razorpay order via edge function
      const response = await fetch(
        'https://enlxxeyzthcphnettkeu.supabase.co/functions/v1/create-razorpay-order',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: activeAmount,
            currency: 'INR',
            receipt: `consult_${Date.now()}`,
            notes: { type: 'consultation', user_id: user.id },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create order');
      }

      const { order_id, key_id } = await response.json();

      // 2. Save pending payment record
      const { error: insertError } = await supabase
        .from('consultation_payments' as any)
        .insert({
          user_id: user.id,
          amount: activeAmount,
          currency: 'INR',
          razorpay_order_id: order_id,
          status: 'pending',
        });

      if (insertError) console.error('Insert error:', insertError);

      // 3. Open Razorpay checkout
      const options: RazorpayOptions = {
        key: key_id,
        amount: activeAmount * 100,
        currency: 'INR',
        name: 'Astro Vichar',
        description: 'Consultation Payment',
        order_id,
        handler: async (res: RazorpayResponse) => {
          // Payment successful
          try {
            await supabase
              .from('consultation_payments' as any)
              .update({
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                status: 'paid',
              } as any)
              .eq('razorpay_order_id', order_id);

            setPaymentDetails({
              payment_id: res.razorpay_payment_id,
              order_id: res.razorpay_order_id,
              amount: activeAmount,
            });
            setPaymentStatus('success');
            toast.success('भुगतान सफल! / Payment successful!');

            // Send confirmation email (non-blocking)
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token && user?.email) {
              fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://enlxxeyzthcphnettkeu.supabase.co'}/functions/v1/send-notification`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                  type: 'consultation_payment_success',
                  email: user.email,
                  data: {
                    userName: user.user_metadata?.full_name || user.email,
                    paymentId: res.razorpay_payment_id,
                    paymentAmount: activeAmount,
                  },
                }),
              }).catch(err => console.error('Email notification error:', err));
            }
          } catch (err) {
            console.error('Save payment error:', err);
            setPaymentStatus('success');
            toast.success('Payment received but save failed. Contact support.');
          }
          setIsProcessing(false);
        },
        prefill: { email: user.email || '' },
        theme: { color: '#D4A54A' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (failRes: any) => {
        const errDesc = failRes?.error?.description || 'Payment failed';
        await supabase
          .from('consultation_payments' as any)
          .update({ status: 'failed' } as any)
          .eq('razorpay_order_id', order_id);

        setPaymentStatus('failed');
        setIsProcessing(false);
        toast.error(`भुगतान विफल / ${errDesc}`);
      });

      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment initiation failed');
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'success' && paymentDetails) {
    return (
      <Card className="bg-card/50 border-green-500/30 backdrop-blur-sm mt-8">
        <CardContent className="p-6 text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h3 className="text-xl font-bold text-green-400">भुगतान सफल! / Payment Successful!</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Payment ID:</strong> {paymentDetails.payment_id}</p>
            <p><strong>Order ID:</strong> {paymentDetails.order_id}</p>
            <p><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            आपको ईमेल पर कन्फर्मेशन भेजा जाएगा। / You will receive a confirmation email shortly.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={() => generateConsultationReceipt({
                paymentId: paymentDetails.payment_id,
                orderId: paymentDetails.order_id,
                amount: paymentDetails.amount,
                currency: 'INR',
                status: 'paid',
                date: format(new Date(), 'dd MMM yyyy, hh:mm a'),
                userEmail: user?.email || undefined,
              })}
              className="bg-primary text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              onClick={() => navigate('/my-wallet')}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              View My Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="bg-card/50 border-destructive/30 backdrop-blur-sm mt-8">
        <CardContent className="p-6 text-center space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h3 className="text-xl font-bold text-destructive">भुगतान विफल / Payment Failed</h3>
          <p className="text-sm text-muted-foreground">
            कृपया पुनः प्रयास करें। / Please try again.
          </p>
          <Button onClick={() => setPaymentStatus('idle')} variant="outline" className="border-primary/50">
            पुनः प्रयास / Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-primary/30 backdrop-blur-sm mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <CreditCard className="w-5 h-5" />
          Pay for Consultation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Preset amounts */}
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">Select Amount (₹)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((val) => (
              <Button
                key={val}
                variant={amount === val && !customAmount ? 'default' : 'outline'}
                className={amount === val && !customAmount ? 'bg-primary text-primary-foreground' : 'border-primary/30'}
                onClick={() => handlePresetClick(val)}
              >
                ₹{val.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <Label htmlFor="custom-amount" className="text-sm text-muted-foreground mb-2 block">
            Or enter custom amount (₹)
          </Label>
          <Input
            id="custom-amount"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 3000"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="bg-muted border-primary/20"
          />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-primary/20">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="text-xl font-bold text-primary">₹{activeAmount.toLocaleString()}</span>
        </div>

        {/* Pay button */}
        <Button
          onClick={initiatePayment}
          disabled={isProcessing || !activeAmount || activeAmount < 1}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground font-semibold glow-gold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay Now ₹{activeAmount.toLocaleString()}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          UPI • Credit/Debit Cards • Net Banking • Wallets
        </p>
      </CardContent>
    </Card>
  );
};

export default ConsultationPayment;
