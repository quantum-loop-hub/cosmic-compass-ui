import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Search, Gem, Star, Filter, Plus, Minus, Trash2, X, Heart, GitCompare, Sparkles } from 'lucide-react';
import { useGemstoneStore } from '@/hooks/useGemstoneStore';
import { categories, priceRanges, sortOptions, mockProducts } from '@/data/gemstoneProducts';
import { toast } from 'sonner';
import CheckoutDialog from '@/components/checkout/CheckoutDialog';
import { useAuth } from '@/contexts/AuthContext';

const COMPARE_KEY = 'gemstone_compare';

const GemstoneStore = () => {
  const { user } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();
  const {
    searchQuery,
    cart,
    selectedCategory,
    selectedPriceRange,
    sortBy,
    showFilters,
    isCartOpen,
    isCheckingOut,
    filteredProducts,
    cartTotal,
    cartItemCount,
    hasActiveFilters,
    setSearchQuery,
    setSelectedCategory,
    setSelectedPriceRange,
    setSortBy,
    setShowFilters,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
    getWishlistProducts,
    handleCheckout,
    resetFilters,
    formatPrice,
  } = useGemstoneStore();

  const [activeTab, setActiveTab] = useState('all');
  const wishlistProducts = getWishlistProducts();
  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem(COMPARE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
  }, [compareList]);

  const toggleCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        toast.info('Removed from comparison');
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          toast.warning('Maximum 4 items can be compared');
          return prev;
        }
        toast.success('Added to comparison');
        return [...prev, productId];
      }
    });
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  const goToCompare = () => {
    if (compareList.length < 2) {
      toast.warning('Select at least 2 gemstones to compare');
      return;
    }
    navigate(`/gemstone-compare?ids=${compareList.join(',')}`);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Update Banner */}
          {showUpdateBanner && (
            <div className="mb-6 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg p-4 flex items-center justify-between animate-fade-up">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <div>
                  <p className="text-primary font-semibold text-sm sm:text-base">🎉 New Gemstones Added!</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">We've added 8 new precious and semi-precious gemstones to our collection.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowUpdateBanner(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

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

          {/* Tabs for All Products and Wishlist */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card/50 border border-primary/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Gemstones
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist ({wishlistProducts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
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
                                  onClick={() => {
                                    setIsCartOpen(false);
                                    setIsCheckoutOpen(true);
                                  }}
                                >
                                  Proceed to Checkout
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
                      <Link to={`/gemstone/${product.id}`}>
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
                      </Link>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link to={`/gemstone/${product.id}`} className="flex-1">
                            <h3 className="font-semibold text-primary line-clamp-1 text-sm sm:text-base hover:underline">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`h-7 w-7 shrink-0 ${isInCompare(product.id) ? 'text-blue-500 bg-blue-500/10' : 'text-muted-foreground'}`}
                              onClick={() => toggleCompare(product.id)}
                              title="Compare"
                            >
                              <GitCompare className={`w-3.5 h-3.5 ${isInCompare(product.id) ? '' : ''}`} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`h-7 w-7 shrink-0 ${isInWishlist(product.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                              onClick={() => toggleWishlist(product.id)}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>

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
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
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
            </TabsContent>

            <TabsContent value="wishlist">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">Save gemstones you love for later</p>
                  <Button variant="outline" onClick={() => setActiveTab('all')} className="border-primary/50 text-primary">
                    Browse Gemstones
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {wishlistProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-card/50 border-primary/30 hover:border-primary/50 transition-all overflow-hidden group"
                    >
                      <Link to={`/gemstone/${product.id}`}>
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
                      </Link>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link to={`/gemstone/${product.id}`} className="flex-1">
                            <h3 className="font-semibold text-primary line-clamp-1 text-sm sm:text-base hover:underline">
                              {product.name}
                            </h3>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 shrink-0 text-red-500"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 flex-wrap">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                          <span>•</span>
                          <span>{product.caratWeight}ct</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                          <span className="text-lg sm:text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                          <Button
                            size="sm"
                            disabled={!product.inStock}
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
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
            </TabsContent>
          </Tabs>

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

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-primary/50 rounded-full shadow-lg px-4 py-2 flex items-center gap-3 animate-fade-up">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium text-sm">
              {compareList.length} item{compareList.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/50 text-primary h-8"
            onClick={() => setCompareList([])}
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={goToCompare}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-8"
          >
            Compare Now
          </Button>
        </div>
      )}

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        formatPrice={formatPrice}
        onOrderComplete={(orderNumber) => {
          toast.success(`Order ${orderNumber} placed! Check your order history.`);
          navigate('/purchase-history');
        }}
        clearCart={clearCart}
      />
    </Layout>
  );
};

export default GemstoneStore;
