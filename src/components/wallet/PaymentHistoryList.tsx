import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Video, ShoppingBag, Clock, Download } from 'lucide-react';
import { format } from 'date-fns';
import type { ConsultationPayment, GemstoneOrder } from '@/pages/MyWallet';
import { generateConsultationReceipt } from '@/utils/generateReceipt';

interface PaymentHistoryListProps {
  payments: ConsultationPayment[];
  orders: GemstoneOrder[];
  loading: boolean;
}

type FilterType = 'all' | 'consultation' | 'gemstone';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  paid: { label: 'Paid', variant: 'default' },
  pending: { label: 'Pending', variant: 'secondary' },
  failed: { label: 'Failed', variant: 'destructive' },
};

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'consultation', label: 'Consultations' },
  { value: 'gemstone', label: 'Gemstones' },
];

const PaymentHistoryList = ({ payments, orders, loading }: PaymentHistoryListProps) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const allTransactions = [
    ...payments.map(p => ({
      id: p.id,
      date: p.created_at,
      amount: Number(p.amount),
      status: p.status,
      type: 'consultation' as const,
      label: 'Consultation Payment',
      paymentId: p.razorpay_payment_id || '',
      orderId: p.razorpay_order_id || '',
      currency: p.currency,
    })),
    ...orders.map(o => ({
      id: o.id,
      date: o.created_at,
      amount: Number(o.total_amount),
      status: o.payment_status,
      type: 'gemstone' as const,
      label: `Gemstone Order #${o.order_number}`,
    })),
  ]
    .filter(tx => filter === 'all' || tx.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-card/50 border-primary/30 animate-pulse">
            <CardContent className="p-4 h-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2">
        {filters.map(f => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? 'bg-primary text-primary-foreground' : 'border-primary/30'}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {allTransactions.length === 0 ? (
        <Card className="bg-card/50 border-primary/30">
          <CardContent className="p-12 text-center">
            <Wallet className="h-16 w-16 mx-auto text-primary/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'Your payment history will appear here.' : `No ${filter} transactions found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allTransactions.map((tx) => {
            const cfg = statusConfig[tx.status] || statusConfig.pending;
            const Icon = tx.type === 'consultation' ? Video : ShoppingBag;

            return (
              <Card key={tx.id} className="bg-card/50 border-primary/30 hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${tx.type === 'consultation' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                      <Icon className={`h-4 w-4 ${tx.type === 'consultation' ? 'text-primary' : 'text-accent-foreground'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{tx.label}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(tx.date), 'dd MMM yyyy, hh:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {tx.type === 'consultation' && tx.status === 'paid' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-primary hover:bg-primary/10"
                        title="Download Receipt"
                        onClick={() => generateConsultationReceipt({
                          paymentId: tx.paymentId || '',
                          orderId: tx.orderId || '',
                          amount: tx.amount,
                          currency: tx.currency || 'INR',
                          status: tx.status,
                          date: format(new Date(tx.date), 'dd MMM yyyy, hh:mm a'),
                        })}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                    <span className="font-bold text-primary whitespace-nowrap">₹{tx.amount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryList;
