import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

interface SpendingChartProps {
  data: { month: string; amount: number; consultation?: number; gemstone?: number }[];
  totalSpent: number;
  consultationSpent?: number;
  gemstoneSpent?: number;
}

const SpendingChart = ({ data, totalSpent, consultationSpent = 0, gemstoneSpent = 0 }: SpendingChartProps) => {
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

  const hasBreakdown = data.some(d => d.consultation !== undefined);

  return (
    <div className="space-y-6">
      {/* Spending breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-primary/30">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-xs mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-primary">₹{totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/30">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-xs mb-1">Consultations</p>
            <p className="text-2xl font-bold text-primary">₹{consultationSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/30">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-xs mb-1">Gemstones</p>
            <p className="text-2xl font-bold text-primary">₹{gemstoneSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

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
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString()}`,
                    name === 'consultation' ? 'Consultations' : name === 'gemstone' ? 'Gemstones' : 'Amount',
                  ]}
                />
                {hasBreakdown ? (
                  <>
                    <Legend />
                    <Bar dataKey="consultation" name="Consultations" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="gemstone" name="Gemstones" stackId="a" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingChart;
