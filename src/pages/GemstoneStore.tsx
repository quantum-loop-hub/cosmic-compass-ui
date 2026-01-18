import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Gem, Star, Filter, Plus, Minus, Trash2, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  gemstoneType: string;
  caratWeight: number;
  origin: string;
  benefits: string[];
  image: string;
  rating: number;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const mockProducts: Product[] = [
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

const categories = ['All', 'Precious', 'Semi-Precious', 'Organic'];
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹15,000', min: 0, max: 15000 },
  { label: '₹15,000 - ₹30,000', min: 15000, max: 30000 },
  { label: '₹30,000 - ₹50,000', min: 30000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity },
];
const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating: High to Low', value: 'rating-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
];

const GemstoneStore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.gemstoneType.toLowerCase().includes(query) ||
        p.benefits.some(b => b.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Price filter
    const priceRange = priceRanges[selectedPriceRange];
    products = products.filter(p => p.price >= priceRange.min && p.price < priceRange.max);

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        toast.success(`Updated ${product.name} quantity`);
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`Added ${product.name} to cart`);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCart([]);
      setIsCartOpen(false);
      toast.success('Order placed successfully! We will contact you shortly.', {
        duration: 5000,
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });
    }, 2000);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRange(0);
    setSortBy('default');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedPriceRange !== 0 || sortBy !== 'default';

  return (
    <Layout>
      <div className="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4">
              <Gem className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-gradient-gold">Gemstone Store</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              Certified natural gemstones recommended based on Vedic astrology.
              Each stone comes with a certificate of authenticity.
            </p>
          </div>

          {/* Search, Filters & Cart */}
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            {/* Top row - Search and Cart */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search gemstones, benefits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-primary/30 text-black placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-primary/50 text-primary flex-1 sm:flex-none"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                      !
                    </Badge>
                  )}
                </Button>
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-primary/50 text-primary relative flex-1 sm:flex-none">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md bg-card border-primary/30">
                    <SheetHeader>
                      <SheetTitle className="text-primary flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Your Cart ({cartItemCount} items)
                      </SheetTitle>
                    </SheetHeader>
                    
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                        <p>Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-auto py-4 space-y-4 max-h-[60vh]">
                          {cart.map((item) => (
                            <div key={item.product.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground text-sm line-clamp-2">{item.product.name}</h4>
                                <p className="text-primary font-semibold text-sm">{formatPrice(item.product.price)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 border-primary/30"
                                    onClick={() => updateQuantity(item.product.id, -1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center text-foreground font-medium">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 border-primary/30"
                                    onClick={() => updateQuantity(item.product.id, 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive ml-auto"
                                    onClick={() => removeFromCart(item.product.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <SheetFooter className="flex-col gap-3 mt-4 border-t border-primary/20 pt-4">
                          <div className="flex justify-between w-full text-lg">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-bold text-primary">{formatPrice(cartTotal)}</span>
                          </div>
                          <div className="flex gap-2 w-full">
                            <Button
                              variant="outline"
                              className="flex-1 border-primary/30"
                              onClick={clearCart}
                            >
                              Clear Cart
                            </Button>
                            <Button
                              className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold"
                              onClick={handleCheckout}
                              disabled={isCheckingOut}
                            >
                              {isCheckingOut ? 'Processing...' : 'Proceed to Pay'}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            Free shipping on orders above ₹10,000
                          </p>
                        </SheetFooter>
                      </>
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-card/50 border border-primary/20 rounded-lg p-4 animate-fade-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-primary">Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                      <X className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white border-primary/30 text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Price Range</label>
                    <Select value={String(selectedPriceRange)} onValueChange={(v) => setSelectedPriceRange(Number(v))}>
                      <SelectTrigger className="bg-white border-primary/30 text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map((range, i) => (
                          <SelectItem key={i} value={String(i)}>{range.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-white border-primary/30 text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {mockProducts.length} gemstones
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Gem className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No gemstones found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={resetFilters} className="border-primary/50 text-primary">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-card/50 border-primary/30 hover:border-primary/50 transition-all overflow-hidden group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-destructive/80 text-destructive-foreground">Out of Stock</Badge>
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-primary mb-1 line-clamp-1 text-sm sm:text-base">{product.name}</h3>

                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 flex-wrap">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span>•</span>
                      <span>{product.caratWeight}ct</span>
                      <span>•</span>
                      <span>{product.origin}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.benefits.slice(0, 2).map((b) => (
                        <Badge key={b} variant="outline" className="border-accent/30 text-accent text-xs">
                          {b}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                      <span className="text-lg sm:text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                      <Button
                        size="sm"
                        disabled={!product.inStock}
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground font-semibold text-xs sm:text-sm"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Trust Section */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            {[
              { icon: '💎', title: '100% Natural', desc: 'Certified authentic gemstones' },
              { icon: '📜', title: 'Lab Certified', desc: 'Each stone comes with certification' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹10,000' },
            ].map((item, i) => (
              <div key={i} className="bg-card/50 border border-primary/20 rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                <h3 className="text-primary font-semibold text-sm sm:text-base">{item.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GemstoneStore;
