import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SpendingChartProps {
  data: { month: string; amount: number }[];
  totalSpent: number;
}

const SpendingChart = ({ data, totalSpent }: SpendingChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="bg-card/50 border-primary/30">
        <CardContent className="p-12 text-center">
          <TrendingUp className="h-16 w-16 mx-auto text-primary/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
          <p className="text-muted-foreground">
            Spending analytics will appear after your first successful payment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lifetime total */}
      <Card className="bg-card/50 border-primary/30">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground text-sm mb-1">Lifetime Consultation Spend</p>
          <p className="text-4xl font-bold text-primary">₹{totalSpent.toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Monthly chart */}
      <Card className="bg-card/50 border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5" />
            Monthly Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--primary) / 0.3)',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingChart;
