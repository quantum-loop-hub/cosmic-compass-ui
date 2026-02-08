
-- Create consultation_payments table
CREATE TABLE public.consultation_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_payments FORCE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.consultation_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.consultation_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON public.consultation_payments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON public.consultation_payments FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all payments"
  ON public.consultation_payments FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_consultation_payments_updated_at
  BEFORE UPDATE ON public.consultation_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
