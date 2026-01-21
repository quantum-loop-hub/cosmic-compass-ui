import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, Users, Search, TrendingUp, ShoppingBag, 
  IndianRupee, Eye, Phone, Mail, Calendar, Package, Video
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
  BarChart,
  Bar,
} from 'recharts';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  user_id: string;
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
}

interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  total_spent: number;
  order_count: number;
  created_at: string;
}

interface CustomerDetails {
  profile: CustomerProfile;
  orders: Order[];
}

const AdminCustomers = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      // Fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('total_spent', { ascending: false });

      if (profilesError) throw profilesError;

      const parsedOrders = (ordersData || []).map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        shipping_address: typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address,
      }));

      setOrders(parsedOrders);
      setProfiles(profilesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  // Aggregate customer data from orders
  const customers = useMemo(() => {
    const customerMap = new Map<string, {
      user_id: string;
      totalSpent: number;
      orderCount: number;
      lastOrder: string;
      name: string;
      email: string;
      phone: string;
    }>();

    orders.forEach(order => {
      const existing = customerMap.get(order.user_id);
      const shippingName = order.shipping_address?.name || '';
      const shippingPhone = order.shipping_address?.phone || '';

      if (existing) {
        existing.totalSpent += Number(order.total_amount);
        existing.orderCount += 1;
        if (new Date(order.created_at) > new Date(existing.lastOrder)) {
          existing.lastOrder = order.created_at;
          if (shippingName) existing.name = shippingName;
          if (shippingPhone) existing.phone = shippingPhone;
        }
      } else {
        customerMap.set(order.user_id, {
          user_id: order.user_id,
          totalSpent: Number(order.total_amount),
          orderCount: 1,
          lastOrder: order.created_at,
          name: shippingName || 'Unknown Customer',
          email: '',
          phone: shippingPhone,
        });
      }
    });

    // Merge with profiles
    profiles.forEach(profile => {
      const customer = customerMap.get(profile.user_id);
      if (customer) {
        if (profile.full_name) customer.name = profile.full_name;
        if (profile.email) customer.email = profile.email;
        if (profile.phone) customer.phone = profile.phone;
      }
    });

    return Array.from(customerMap.values());
  }, [orders, profiles]);

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalCustomers = customers.length;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const topCustomer = customers[0];

    return { totalRevenue, totalCustomers, avgOrderValue, topCustomer };
  }, [orders, customers]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );

    switch (sortBy) {
      case 'spent':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'orders':
        filtered.sort((a, b) => b.orderCount - a.orderCount);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime());
        break;
    }

    return filtered;
  }, [customers, searchQuery, sortBy]);

  // Monthly revenue data
  const monthlyRevenue = useMemo(() => {
    const monthData: { [key: string]: number } = {};
    orders.forEach(order => {
      const month = format(new Date(order.created_at), 'MMM');
      monthData[month] = (monthData[month] || 0) + Number(order.total_amount);
    });
    return Object.entries(monthData).map(([month, amount]) => ({ month, amount }));
  }, [orders]);

  const viewCustomerDetails = (customer: typeof customers[0]) => {
    const customerOrdersList = orders.filter(o => o.user_id === customer.user_id);
    setCustomerOrders(customerOrdersList);
    setSelectedCustomer({
      profile: {
        id: customer.user_id,
        user_id: customer.user_id,
        full_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        total_spent: customer.totalSpent,
        order_count: customer.orderCount,
        created_at: customer.lastOrder,
      },
      orders: customerOrdersList,
    });
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'shipped': return 'bg-blue-500/20 text-blue-400';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cosmic-dark to-cosmic-dark/95">
          <div className="animate-spin h-8 w-8 border-2 border-cosmic-gold border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 bg-gradient-to-b from-cosmic-dark to-cosmic-dark/95">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin')}
                className="text-cosmic-gold hover:bg-cosmic-gold/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-cosmic-gold">
                  Customer Management
                </h1>
                <p className="text-cosmic-light/60 text-sm">
                  View all customers and their purchase history
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cosmic-gold/10 rounded-lg">
                    <IndianRupee className="h-5 w-5 text-cosmic-gold" />
                  </div>
                  <div>
                    <p className="text-cosmic-light/60 text-xs">Total Revenue</p>
                    <p className="text-cosmic-gold font-bold text-lg">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cosmic-gold/10 rounded-lg">
                    <Users className="h-5 w-5 text-cosmic-gold" />
                  </div>
                  <div>
                    <p className="text-cosmic-light/60 text-xs">Total Customers</p>
                    <p className="text-cosmic-gold font-bold text-lg">
                      {stats.totalCustomers}
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
                    <p className="text-cosmic-light/60 text-xs">Avg Order Value</p>
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
                  <div className="p-2 bg-cosmic-gold/10 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-cosmic-gold" />
                  </div>
                  <div>
                    <p className="text-cosmic-light/60 text-xs">Total Orders</p>
                    <p className="text-cosmic-gold font-bold text-lg">
                      {orders.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="customers" className="space-y-6">
            <TabsList className="bg-cosmic-dark/50 border border-cosmic-gold/30">
              <TabsTrigger value="customers" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                Customers
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                All Orders
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-light/40" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 bg-cosmic-dark/50 border-cosmic-gold/30 text-cosmic-light">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-cosmic-gold/30">
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="spent">Highest Spending</SelectItem>
                    <SelectItem value="orders">Most Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customers Table */}
              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cosmic-gold/20 hover:bg-transparent">
                      <TableHead className="text-cosmic-gold">Customer</TableHead>
                      <TableHead className="text-cosmic-gold">Contact</TableHead>
                      <TableHead className="text-cosmic-gold text-center">Orders</TableHead>
                      <TableHead className="text-cosmic-gold text-right">Total Spent</TableHead>
                      <TableHead className="text-cosmic-gold">Last Order</TableHead>
                      <TableHead className="text-cosmic-gold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-cosmic-light/50">
                          No customers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.user_id} className="border-cosmic-gold/10 hover:bg-cosmic-gold/5">
                          <TableCell className="text-cosmic-light font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {customer.email && (
                                <div className="flex items-center gap-1 text-cosmic-light/70 text-sm">
                                  <Mail className="h-3 w-3" />
                                  {customer.email}
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center gap-1 text-cosmic-light/70 text-sm">
                                  <Phone className="h-3 w-3" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-cosmic-light">
                            {customer.orderCount}
                          </TableCell>
                          <TableCell className="text-right text-cosmic-gold font-semibold">
                            ₹{customer.totalSpent.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-cosmic-light/70 text-sm">
                            {format(new Date(customer.lastOrder), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-cosmic-gold hover:bg-cosmic-gold/10"
                                onClick={() => viewCustomerDetails(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:bg-blue-400/10"
                                onClick={() => toast.info('Video call feature coming soon!')}
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cosmic-gold/20 hover:bg-transparent">
                      <TableHead className="text-cosmic-gold">Order #</TableHead>
                      <TableHead className="text-cosmic-gold">Customer</TableHead>
                      <TableHead className="text-cosmic-gold text-center">Items</TableHead>
                      <TableHead className="text-cosmic-gold text-right">Amount</TableHead>
                      <TableHead className="text-cosmic-gold text-center">Status</TableHead>
                      <TableHead className="text-cosmic-gold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 50).map((order) => (
                      <TableRow key={order.id} className="border-cosmic-gold/10 hover:bg-cosmic-gold/5">
                        <TableCell className="text-cosmic-light font-mono text-sm">
                          {order.order_number}
                        </TableCell>
                        <TableCell className="text-cosmic-light">
                          {order.shipping_address?.name || 'N/A'}
                        </TableCell>
                        <TableCell className="text-center text-cosmic-light">
                          {order.items.length}
                        </TableCell>
                        <TableCell className="text-right text-cosmic-gold font-semibold">
                          ₹{Number(order.total_amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getStatusColor(order.order_status)}>
                            {order.order_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cosmic-light/70 text-sm">
                          {format(new Date(order.created_at), 'dd MMM yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold text-lg">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#D4AF3720" />
                        <XAxis dataKey="month" stroke="#D4AF37" fontSize={12} />
                        <YAxis stroke="#D4AF37" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1a2e',
                            border: '1px solid #D4AF3750',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="amount" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold text-lg">Top Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customers.slice(0, 5).map((customer, index) => (
                        <div key={customer.user_id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-cosmic-gold/20 flex items-center justify-center text-cosmic-gold font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-cosmic-light font-medium">{customer.name}</p>
                            <p className="text-cosmic-light/60 text-sm">{customer.orderCount} orders</p>
                          </div>
                          <p className="text-cosmic-gold font-bold">
                            ₹{customer.totalSpent.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-cosmic-dark border-cosmic-gold/30 max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-cosmic-gold flex items-center gap-3">
              <Users className="h-5 w-5" />
              Customer Profile
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pr-4">
                {/* Customer Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="bg-cosmic-dark/50 border-cosmic-gold/20">
                    <CardContent className="p-4">
                      <h4 className="text-cosmic-light font-medium mb-3">Contact Info</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-cosmic-light">{selectedCustomer.profile.full_name}</p>
                        {selectedCustomer.profile.email && (
                          <p className="text-cosmic-light/70 flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {selectedCustomer.profile.email}
                          </p>
                        )}
                        {selectedCustomer.profile.phone && (
                          <p className="text-cosmic-light/70 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {selectedCustomer.profile.phone}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-cosmic-dark/50 border-cosmic-gold/20">
                    <CardContent className="p-4">
                      <h4 className="text-cosmic-light font-medium mb-3">Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-cosmic-light/60 text-xs">Total Spent</p>
                          <p className="text-cosmic-gold font-bold text-xl">
                            ₹{selectedCustomer.profile.total_spent.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-cosmic-light/60 text-xs">Orders</p>
                          <p className="text-cosmic-gold font-bold text-xl">
                            {selectedCustomer.profile.order_count}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order History */}
                <div>
                  <h4 className="text-cosmic-light font-medium mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4 text-cosmic-gold" />
                    Order History
                  </h4>
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <Card key={order.id} className="bg-cosmic-dark/30 border-cosmic-gold/10">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-cosmic-gold font-mono text-sm">
                                {order.order_number}
                              </p>
                              <p className="text-cosmic-light/60 text-xs">
                                {format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.order_status)}>
                                {order.order_status}
                              </Badge>
                              <p className="text-cosmic-gold font-bold mt-1">
                                ₹{Number(order.total_amount).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminCustomers;
