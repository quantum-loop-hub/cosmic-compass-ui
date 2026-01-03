import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Gem, Star, Filter } from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    name: 'Natural Blue Sapphire (Neelam)',
    price: 45000,
    category: 'Precious',
    gemstoneType: 'Blue Sapphire',
    caratWeight: 3.5,
    origin: 'Sri Lanka',
    benefits: ['Wealth', 'Career Success', 'Mental Clarity'],
    image: 'https://images.unsplash.com/photo-1615655114865-4cc47b6e29cf?w=400&h=400&fit=crop',
    rating: 4.8,
    inStock: true,
  },
  {
    id: '2',
    name: 'Premium Ruby (Manik)',
    price: 55000,
    category: 'Precious',
    gemstoneType: 'Ruby',
    caratWeight: 2.8,
    origin: 'Burma',
    benefits: ['Leadership', 'Confidence', 'Health'],
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&h=400&fit=crop',
    rating: 4.9,
    inStock: true,
  },
  {
    id: '3',
    name: 'Colombian Emerald (Panna)',
    price: 38000,
    category: 'Precious',
    gemstoneType: 'Emerald',
    caratWeight: 4.2,
    origin: 'Colombia',
    benefits: ['Intelligence', 'Communication', 'Business'],
    image: 'https://images.unsplash.com/photo-1583937443366-6c668838436e?w=400&h=400&fit=crop',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '4',
    name: 'Yellow Sapphire (Pukhraj)',
    price: 32000,
    category: 'Precious',
    gemstoneType: 'Yellow Sapphire',
    caratWeight: 5.0,
    origin: 'Sri Lanka',
    benefits: ['Wisdom', 'Marriage', 'Prosperity'],
    image: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400&h=400&fit=crop',
    rating: 4.8,
    inStock: true,
  },
  {
    id: '5',
    name: "Cat's Eye (Lehsunia)",
    price: 18000,
    category: 'Semi-Precious',
    gemstoneType: "Cat's Eye",
    caratWeight: 6.5,
    origin: 'India',
    benefits: ['Protection', 'Intuition', 'Recovery'],
    image: 'https://images.unsplash.com/photo-1551122087-f99a4ade8c1e?w=400&h=400&fit=crop',
    rating: 4.6,
    inStock: false,
  },
  {
    id: '6',
    name: 'Natural Pearl (Moti)',
    price: 12000,
    category: 'Organic',
    gemstoneType: 'Pearl',
    caratWeight: 8.0,
    origin: 'Japan',
    benefits: ['Calm', 'Emotional Balance', 'Beauty'],
    image: 'https://images.unsplash.com/photo-1518131672127-5fe53e12ee07?w=400&h=400&fit=crop',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '7',
    name: 'Red Coral (Moonga)',
    price: 15000,
    category: 'Organic',
    gemstoneType: 'Red Coral',
    caratWeight: 7.0,
    origin: 'Italy',
    benefits: ['Courage', 'Vitality', 'Property'],
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop',
    rating: 4.5,
    inStock: true,
  },
  {
    id: '8',
    name: 'Hessonite Garnet (Gomed)',
    price: 22000,
    category: 'Semi-Precious',
    gemstoneType: 'Hessonite',
    caratWeight: 5.5,
    origin: 'Sri Lanka',
    benefits: ['Rahu Relief', 'Mental Peace', 'Career'],
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '9',
    name: 'White Sapphire (Safed Pukhraj)',
    price: 28000,
    category: 'Precious',
    gemstoneType: 'White Sapphire',
    caratWeight: 4.0,
    origin: 'Sri Lanka',
    benefits: ['Venus Blessings', 'Love', 'Luxury'],
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '10',
    name: 'Amethyst (Jamunia)',
    price: 8000,
    category: 'Semi-Precious',
    gemstoneType: 'Amethyst',
    caratWeight: 6.0,
    origin: 'Brazil',
    benefits: ['Peace', 'Meditation', 'Intuition'],
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=400&h=400&fit=crop',
    rating: 4.8,
    inStock: true,
  },
  {
    id: '11',
    name: 'Aquamarine (Beruj)',
    price: 25000,
    category: 'Precious',
    gemstoneType: 'Aquamarine',
    caratWeight: 3.8,
    origin: 'Brazil',
    benefits: ['Courage', 'Communication', 'Travel'],
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop&sat=-100&hue=180',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '12',
    name: 'Opal (Dudhiya Patthar)',
    price: 35000,
    category: 'Precious',
    gemstoneType: 'Opal',
    caratWeight: 4.5,
    origin: 'Australia',
    benefits: ['Creativity', 'Love', 'Confidence'],
    image: 'https://images.unsplash.com/photo-1615655114865-4cc47b6e29cf?w=400&h=400&fit=crop&hue=45',
    rating: 4.9,
    inStock: true,
  },
];

const GemstoneStore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<string[]>([]);

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gemstoneType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (productId: string) => {
    setCart([...cart, productId]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Gem className="w-16 h-16 text-cosmic-gold" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Gemstone Store</span>
            </h1>
            <p className="text-cosmic-silver max-w-2xl mx-auto">
              Certified natural gemstones recommended based on Vedic astrology. 
              Each stone comes with a certificate of authenticity.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-silver" />
              <Input
                placeholder="Search gemstones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-cosmic-dark border-cosmic-gold/30 text-white"
              />
            </div>
            <Button variant="outline" className="border-cosmic-gold/50 text-cosmic-gold">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="border-cosmic-gold/50 text-cosmic-gold relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-cosmic-gold text-cosmic-dark text-xs rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="bg-cosmic-dark/50 border-cosmic-gold/30 hover:border-cosmic-gold/50 transition-all overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-red-500/80 text-white">Out of Stock</Badge>
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-cosmic-gold text-cosmic-dark">
                    {product.category}
                  </Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-cosmic-gold mb-1 line-clamp-1">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-cosmic-silver mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span>•</span>
                    <span>{product.caratWeight} carat</span>
                    <span>•</span>
                    <span>{product.origin}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.benefits.slice(0, 2).map((b) => (
                      <Badge key={b} variant="outline" className="border-cosmic-cyan/30 text-cosmic-cyan text-xs">
                        {b}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-cosmic-gold/20">
                    <span className="text-xl font-bold text-cosmic-gold">{formatPrice(product.price)}</span>
                    <Button
                      size="sm"
                      disabled={!product.inStock}
                      onClick={() => addToCart(product.id)}
                      className="bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Section */}
          <div className="mt-16 grid md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '💎', title: '100% Natural', desc: 'Certified authentic gemstones' },
              { icon: '📜', title: 'Lab Certified', desc: 'Each stone comes with certification' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹10,000' },
            ].map((item, i) => (
              <div key={i} className="bg-cosmic-dark/50 border border-cosmic-gold/20 rounded-lg p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="text-cosmic-gold font-semibold">{item.title}</h3>
                <p className="text-cosmic-silver text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GemstoneStore;
