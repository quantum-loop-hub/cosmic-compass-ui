import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Package, 
  ShoppingBag,
  TrendingUp,
  IndianRupee,
  Star
} from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-cosmic-gold">Loading...</div>
        </div>
      </Layout>
    );
  }

  // For demo purposes, show admin panel even without checking role
  // In production, you'd check isAdmin after Supabase is connected

  const stats = [
    { icon: Users, label: 'Total Users', value: '12,450', change: '+12%' },
    { icon: Calendar, label: 'Bookings Today', value: '48', change: '+8%' },
    { icon: ShoppingBag, label: 'Orders', value: '156', change: '+23%' },
    { icon: IndianRupee, label: 'Revenue', value: '₹2.4L', change: '+15%' },
  ];

  const recentBookings = [
    { id: 1, user: 'Priya S.', astrologer: 'Pandit Ramesh', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, user: 'Rahul K.', astrologer: 'Acharya Deepak', time: '11:30 AM', status: 'Pending' },
    { id: 3, user: 'Anita P.', astrologer: 'Meera Devi', time: '2:00 PM', status: 'Confirmed' },
    { id: 4, user: 'Vikram S.', astrologer: 'Dr. Suresh', time: '3:30 PM', status: 'Confirmed' },
  ];

  const recentOrders = [
    { id: 'ORD001', product: 'Blue Sapphire', amount: '₹45,000', status: 'Shipped' },
    { id: 'ORD002', product: 'Ruby Ring', amount: '₹55,000', status: 'Processing' },
    { id: 'ORD003', product: 'Pearl Pendant', amount: '₹12,000', status: 'Delivered' },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-gradient-gold">Admin Dashboard</span>
              </h1>
              <p className="text-cosmic-silver">Manage your astrology platform</p>
            </div>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-cosmic-gold" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-cosmic-dark/50 border-cosmic-gold/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-cosmic-silver text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-cosmic-gold mt-1">{stat.value}</p>
                    </div>
                    <div className="p-2 bg-cosmic-gold/10 rounded-lg">
                      <stat.icon className="w-6 h-6 text-cosmic-gold" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">{stat.change}</span>
                    <span className="text-cosmic-silver text-sm">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button className="bg-cosmic-dark border border-cosmic-gold/30 hover:bg-cosmic-gold/10 text-cosmic-gold h-auto py-4">
              <Users className="w-5 h-5 mr-2" />
              Manage Astrologers
            </Button>
            <Button className="bg-cosmic-dark border border-cosmic-gold/30 hover:bg-cosmic-gold/10 text-cosmic-gold h-auto py-4">
              <Package className="w-5 h-5 mr-2" />
              Manage Products
            </Button>
            <Button className="bg-cosmic-dark border border-cosmic-gold/30 hover:bg-cosmic-gold/10 text-cosmic-gold h-auto py-4">
              <Calendar className="w-5 h-5 mr-2" />
              View Bookings
            </Button>
            <Button className="bg-cosmic-dark border border-cosmic-gold/30 hover:bg-cosmic-gold/10 text-cosmic-gold h-auto py-4">
              <ShoppingBag className="w-5 h-5 mr-2" />
              View Orders
            </Button>
          </div>

          {/* Tables */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader>
                <CardTitle className="text-cosmic-gold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Bookings
                </CardTitle>
                <CardDescription className="text-cosmic-silver">
                  Upcoming consultation appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-cosmic-darker/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{booking.user}</p>
                        <p className="text-cosmic-silver text-sm">{booking.astrologer} • {booking.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader>
                <CardTitle className="text-cosmic-gold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-cosmic-silver">
                  Latest gemstone orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-cosmic-darker/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{order.product}</p>
                        <p className="text-cosmic-silver text-sm">{order.id} • {order.amount}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'Delivered' 
                          ? 'bg-green-500/20 text-green-400' 
                          : order.status === 'Shipped'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notice */}
          <Card className="mt-8 bg-cosmic-darker/50 border-cosmic-purple/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Star className="w-8 h-8 text-cosmic-purple flex-shrink-0" />
                <div>
                  <h3 className="text-cosmic-purple font-semibold">Connect Supabase for Full Functionality</h3>
                  <p className="text-cosmic-silver text-sm mt-1">
                    To enable real data management, user authentication, and database operations, 
                    please connect your Supabase project. This will unlock all admin features including 
                    user management, booking management, order processing, and more.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
