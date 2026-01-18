import { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, mockProducts, priceRanges } from '@/data/gemstoneProducts';
import { toast } from 'sonner';

export interface CartItem {
  product: Product;
  quantity: number;
}

const WISHLIST_KEY = 'gemstone_wishlist';
const CART_KEY = 'gemstone_cart';

export const useGemstoneStore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Persist cart and wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.gemstoneType.toLowerCase().includes(query) ||
        p.benefits.some(b => b.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'All') {
      products = products.filter(p => p.category === selectedCategory);
    }

    const priceRange = priceRanges[selectedPriceRange];
    products = products.filter(p => p.price >= priceRange.min && p.price < priceRange.max);

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

  const addToCart = useCallback((product: Product) => {
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
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.info('Item removed from cart');
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    toast.info('Cart cleared');
  }, []);

  // Wishlist functions
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const isInWishlist = prev.includes(productId);
      if (isInWishlist) {
        toast.info('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Added to wishlist');
        return [...prev, productId];
      }
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const getWishlistProducts = useCallback(() => {
    return mockProducts.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = useCallback(() => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCart([]);
      setIsCartOpen(false);
      toast.success('Order placed successfully! We will contact you shortly.', {
        duration: 5000,
      });
    }, 2000);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRange(0);
    setSortBy('default');
  }, []);

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedPriceRange !== 0 || sortBy !== 'default';

  const getProductById = useCallback((id: string) => {
    return mockProducts.find(p => p.id === id);
  }, []);

  const getRelatedProducts = useCallback((product: Product, limit = 4) => {
    return mockProducts
      .filter(p => p.id !== product.id && (p.category === product.category || p.gemstoneType === product.gemstoneType))
      .slice(0, limit);
  }, []);

  return {
    // State
    searchQuery,
    cart,
    wishlist,
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
    
    // Setters
    setSearchQuery,
    setSelectedCategory,
    setSelectedPriceRange,
    setSortBy,
    setShowFilters,
    setIsCartOpen,
    
    // Actions
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
    getProductById,
    getRelatedProducts,
  };
};
