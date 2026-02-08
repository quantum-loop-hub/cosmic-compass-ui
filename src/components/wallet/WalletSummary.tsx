import { Card, CardContent } from '@/components/ui/card';
import { Wallet, IndianRupee, CheckCircle, Clock, XCircle } from 'lucide-react';

interface WalletSummaryProps {
  stats: {
    totalSpent: number;
    totalPayments: number;
    successfulPayments: number;
    pendingPayments: number;
    failedPayments: number;
  };
}

const WalletSummary = ({ stats }: WalletSummaryProps) => {
  const cards = [
    {
      label: 'Total Spent',
      value: `₹${stats.totalSpent.toLocaleString()}`,
      icon: IndianRupee,
      accent: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Successful',
      value: stats.successfulPayments,
      icon: CheckCircle,
      accent: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Pending',
      value: stats.pendingPayments,
      icon: Clock,
      accent: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Failed',
      value: stats.failedPayments,
      icon: XCircle,
      accent: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="bg-card/50 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.accent}`} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">{card.label}</p>
                <p className={`font-bold text-lg ${card.accent}`}>{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WalletSummary;
