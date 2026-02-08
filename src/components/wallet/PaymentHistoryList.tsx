import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import type { ConsultationPayment } from '@/pages/MyWallet';

interface PaymentHistoryListProps {
  payments: ConsultationPayment[];
  loading: boolean;
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  paid: { icon: CheckCircle, color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Paid' },
  pending: { icon: Clock, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pending' },
  failed: { icon: XCircle, color: 'bg-destructive/20 text-destructive border-destructive/30', label: 'Failed' },
};

const PaymentHistoryList = ({ payments, loading }: PaymentHistoryListProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-muted-foreground mt-4">Loading payments...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="bg-card/50 border-primary/30">
        <CardContent className="p-12 text-center">
          <CreditCard className="h-16 w-16 mx-auto text-primary/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Payments Yet</h3>
          <p className="text-muted-foreground">
            Your consultation payment history will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => {
        const config = statusConfig[payment.status] || statusConfig.pending;
        const StatusIcon = config.icon;

        return (
          <Card key={payment.id} className="bg-card/50 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">Consultation Payment</p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(payment.created_at), 'dd MMM yyyy, hh:mm a')}
                    </p>
                    {payment.razorpay_payment_id && (
                      <p className="text-muted-foreground text-xs truncate mt-0.5">
                        ID: {payment.razorpay_payment_id}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-bold text-primary text-lg">
                    ₹{Number(payment.amount).toLocaleString()}
                  </span>
                  <Badge className={config.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PaymentHistoryList;
