import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Wallet, IndianRupee, CreditCard, TrendingUp,
  Calendar, CheckCircle, XCircle, Clock, Video
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import WalletSummary from '@/components/wallet/WalletSummary';
import PaymentHistoryList from '@/components/wallet/PaymentHistoryList';
import SpendingChart from '@/components/wallet/SpendingChart';

export interface ConsultationPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
}

const MyWallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<ConsultationPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPayments();
    else setLoading(false);
  }, [user]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_payments')
        .select('id, amount, currency, status, razorpay_order_id, razorpay_payment_id, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalSpent = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const totalPayments = payments.length;
    const successfulPayments = payments.filter(p => p.status === 'paid').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    return { totalSpent, totalPayments, successfulPayments, pendingPayments, failedPayments };
  }, [payments]);

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    payments
      .filter(p => p.status === 'paid')
      .forEach(p => {
        const key = format(new Date(p.created_at), 'MMM yyyy');
        months[key] = (months[key] || 0) + Number(p.amount);
      });
    return Object.entries(months).map(([month, amount]) => ({ month, amount }));
  }, [payments]);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen py-20 px-4">
          <Card className="bg-card/50 border-primary/30 max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Wallet className="h-16 w-16 mx-auto text-primary/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">Please sign in to view your wallet.</p>
              <Button onClick={() => navigate('/auth')} className="bg-primary text-primary-foreground">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="text-gradient-gold">My Wallet</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Your consultation payments & spending overview
              </p>
            </div>
          </div>

          {/* Wallet Summary Cards */}
          <WalletSummary stats={stats} />

          {/* Tabs */}
          <Tabs defaultValue="history" className="mt-8 space-y-6">
            <TabsList className="bg-card/50 border border-primary/30">
              <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Payment History
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Spending Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <PaymentHistoryList payments={payments} loading={loading} />
            </TabsContent>

            <TabsContent value="analytics">
              <SpendingChart data={monthlyData} totalSpent={stats.totalSpent} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default MyWallet;
