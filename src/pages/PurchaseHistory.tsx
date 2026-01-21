import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Package, Search, TrendingUp, ShoppingBag, 
  Calendar, IndianRupee, Eye, Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  shipping_address: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  } | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const COLORS = ['#D4AF37', '#FFD700', '#B8860B', '#DAA520', '#F0E68C'];

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse the items JSON for each order
      const parsedOrders = (data || []).map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        shipping_address: typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address,
      }));
      
      setOrders(parsedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const completedOrders = orders.filter(o => o.order_status === 'delivered').length;

    return { totalSpent, totalOrders, avgOrderValue, completedOrders };
  }, [orders]);

  // Monthly spending data for chart
  const monthlySpending = useMemo(() => {
    const monthData: { [key: string]: number } = {};
    orders.forEach(order => {
      const month = format(new Date(order.created_at), 'MMM yyyy');
      monthData[month] = (monthData[month] || 0) + Number(order.total_amount);
    });
    return Object.entries(monthData).map(([month, amount]) => ({ month, amount }));
  }, [orders]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const categories: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.name.split(' ')[0]; // First word as category
        categories[name] = (categories[name] || 0) + (item.price * item.quantity);
      });
    });
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 5);
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        if (dateFilter === '7days') {
          matchesDate = (now.getTime() - orderDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === '30days') {
          matchesDate = (now.getTime() - orderDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === '90days') {
          matchesDate = (now.getTime() - orderDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen py-8 bg-gradient-to-b from-cosmic-dark to-cosmic-dark/95">
          <div className="container mx-auto px-4">
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto text-cosmic-gold/50 mb-4" />
                <h2 className="text-xl font-semibold text-cosmic-light mb-2">
                  Sign In Required
                </h2>
                <p className="text-cosmic-light/60 mb-6">
                  Please sign in to view your purchase history.
                </p>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 bg-gradient-to-b from-cosmic-dark to-cosmic-dark/95">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-cosmic-gold hover:bg-cosmic-gold/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cosmic-gold">
                Purchase History
              </h1>
              <p className="text-cosmic-light/60 text-sm">
                View your orders, spending trends, and analytics
              </p>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-cosmic-dark/50 border border-cosmic-gold/30">
              <TabsTrigger value="orders" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                Orders
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cosmic-gold/10 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-cosmic-gold" />
                    </div>
                    <div>
                      <p className="text-cosmic-light/60 text-xs">Total Spent</p>
                      <p className="text-cosmic-gold font-bold text-lg">
                        ₹{stats.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cosmic-gold/10 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-cosmic-gold" />
                    </div>
                    <div>
                      <p className="text-cosmic-light/60 text-xs">Total Orders</p>
                      <p className="text-cosmic-gold font-bold text-lg">
                        {stats.totalOrders}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cosmic-gold/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-cosmic-gold" />
                    </div>
                    <div>
                      <p className="text-cosmic-light/60 text-xs">Avg Order</p>
                      <p className="text-cosmic-gold font-bold text-lg">
                        ₹{stats.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Package className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-cosmic-light/60 text-xs">Completed</p>
                      <p className="text-green-400 font-bold text-lg">
                        {stats.completedOrders}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-light/40" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-cosmic-dark/50 border-cosmic-gold/30 text-cosmic-light">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-cosmic-gold/30">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-cosmic-dark/50 border-cosmic-gold/30 text-cosmic-light">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-cosmic-gold/30">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Orders List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-cosmic-gold border-t-transparent rounded-full mx-auto" />
                  <p className="text-cosmic-light/60 mt-4">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardContent className="p-12 text-center">
                    <Package className="h-16 w-16 mx-auto text-cosmic-gold/30 mb-4" />
                    <h3 className="text-lg font-semibold text-cosmic-light mb-2">
                      No Orders Found
                    </h3>
                    <p className="text-cosmic-light/60 mb-6">
                      {orders.length === 0 
                        ? "You haven't placed any orders yet."
                        : "No orders match your search criteria."}
                    </p>
                    <Button
                      onClick={() => navigate('/gemstone-store')}
                      className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                    >
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="bg-cosmic-dark/50 border-cosmic-gold/30 overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Order Items Preview */}
                          <div className="flex -space-x-4">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className="w-16 h-16 rounded-lg border-2 border-cosmic-dark overflow-hidden"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-16 h-16 rounded-lg bg-cosmic-dark/80 border-2 border-cosmic-gold/30 flex items-center justify-center">
                                <span className="text-cosmic-gold text-sm font-medium">
                                  +{order.items.length - 3}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-cosmic-gold font-semibold">
                                  {order.order_number}
                                </p>
                                <p className="text-cosmic-light/60 text-sm">
                                  {format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}
                                </p>
                              </div>
                              <Badge className={getStatusColor(order.order_status)}>
                                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                              <p className="text-cosmic-light">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </p>
                              <p className="text-cosmic-gold font-bold">
                                ₹{Number(order.total_amount).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Action */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-cosmic-gold/30 text-cosmic-gold hover:bg-cosmic-gold/10"
                            onClick={() => {
                              setSelectedOrder(order);
                              setDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Spending Over Time */}
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold text-lg">Spending Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {monthlySpending.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlySpending}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#D4AF3720" />
                          <XAxis dataKey="month" stroke="#D4AF37" fontSize={12} />
                          <YAxis stroke="#D4AF37" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid #D4AF3750',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#D4AF37' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#D4AF37"
                            strokeWidth={2}
                            dot={{ fill: '#D4AF37' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-cosmic-light/50">
                        No spending data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold text-lg">Purchase Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryBreakdown.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid #D4AF3750',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-cosmic-light/50">
                        No category data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-cosmic-dark border-cosmic-gold/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-cosmic-gold">
              Order Details - {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(selectedOrder.order_status)}>
                    {selectedOrder.order_status.charAt(0).toUpperCase() + selectedOrder.order_status.slice(1)}
                  </Badge>
                  <span className="text-cosmic-light/60 text-sm">
                    {format(new Date(selectedOrder.created_at), 'dd MMM yyyy, hh:mm a')}
                  </span>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-cosmic-light font-medium mb-3">Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-3 bg-cosmic-dark/50 p-3 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-cosmic-light font-medium">{item.name}</p>
                          <p className="text-cosmic-light/60 text-sm">Qty: {item.quantity}</p>
                          <p className="text-cosmic-gold">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-cosmic-dark/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-cosmic-light/80">
                    <span>Subtotal</span>
                    <span>₹{Number(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-cosmic-light/80">
                    <span>Shipping</span>
                    <span>₹{Number(selectedOrder.shipping_cost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-cosmic-light/80">
                    <span>Tax</span>
                    <span>₹{Number(selectedOrder.tax_amount).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-cosmic-gold/20 pt-2 flex justify-between font-bold">
                    <span className="text-cosmic-light">Total</span>
                    <span className="text-cosmic-gold">₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div>
                    <h4 className="text-cosmic-light font-medium mb-2">Shipping Address</h4>
                    <div className="bg-cosmic-dark/50 p-3 rounded-lg text-cosmic-light/80 text-sm">
                      <p>{selectedOrder.shipping_address.name}</p>
                      <p>{selectedOrder.shipping_address.address}</p>
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}</p>
                      <p>Phone: {selectedOrder.shipping_address.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PurchaseHistory;
