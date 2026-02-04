import { Package, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const timelineSteps: TimelineStep[] = [
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been confirmed',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    status: 'processing',
    label: 'Processing',
    description: 'Your gemstones are being prepared',
    icon: <Package className="w-5 h-5" />,
  },
  {
    status: 'shipped',
    label: 'Shipped',
    description: 'Your order is on the way',
    icon: <Truck className="w-5 h-5" />,
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Order is out for delivery',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Order has been delivered',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  updatedAt?: string;
}

const OrderTimeline = ({ currentStatus, updatedAt }: OrderTimelineProps) => {
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="font-semibold text-destructive">Order Cancelled</p>
          <p className="text-sm text-muted-foreground">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Order Status</h3>
        {updatedAt && (
          <span className="text-sm text-muted-foreground">
            Updated: {new Date(updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="relative">
        {timelineSteps.map((step, index) => {
          const stepIndex = statusOrder.indexOf(step.status);
          const isCompleted = stepIndex <= currentIndex && stepIndex !== -1;
          const isCurrent = step.status === currentStatus;

          return (
            <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
              {/* Line connector */}
              {index < timelineSteps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-5 w-0.5 h-8 -translate-x-1/2 mt-10',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                  style={{ top: `${index * 64 + 20}px` }}
                />
              )}

              {/* Icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all',
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                  isCurrent && 'ring-4 ring-primary/30'
                )}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <p
                  className={cn(
                    'font-medium',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
