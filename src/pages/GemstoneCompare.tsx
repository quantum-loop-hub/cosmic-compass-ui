import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowLeft, ShoppingCart, Heart, Check, Minus } from 'lucide-react';
import { mockProducts, Product } from '@/data/gemstoneProducts';
import { useGemstoneStore } from '@/hooks/useGemstoneStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

const GemstoneCompare = () => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useGemstoneStore();
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCompare = (product: Product) => {
    if (compareList.length < 4 && !compareList.find(p => p.id === product.id)) {
      setCompareList([...compareList, product]);
    }
    setDialogOpen(false);
    setSearchQuery('');
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(p => p.id !== productId));
  };

  const availableProducts = mockProducts.filter(
    p => !compareList.find(c => c.id === p.id)
  ).filter(
    p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.gemstoneType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const comparisonFields = [
    { key: 'price', label: 'Price', format: (p: Product) => `₹${p.price.toLocaleString()}` },
    { key: 'gemstoneType', label: 'Gemstone Type', format: (p: Product) => p.gemstoneType },
    { key: 'category', label: 'Category', format: (p: Product) => p.category },
    { key: 'weight', label: 'Weight', format: (p: Product) => `${p.caratWeight} ct` },
    { key: 'origin', label: 'Origin', format: (p: Product) => p.origin || '-' },
    { key: 'zodiacSign', label: 'Zodiac Signs', format: (p: Product) => p.zodiacSigns?.join(', ') || '-' },
    { key: 'planet', label: 'Associated Planet', format: (p: Product) => p.planet || '-' },
    { key: 'rating', label: 'Rating', format: (p: Product) => `${p.rating} ⭐` },
    { key: 'inStock', label: 'Availability', format: (p: Product) => p.inStock ? '✅ In Stock' : '❌ Out of Stock' },
  ];

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
                onClick={() => navigate('/gemstone-store')}
                className="text-cosmic-gold hover:bg-cosmic-gold/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-cosmic-gold">
                  Compare Gemstones
                </h1>
                <p className="text-cosmic-light/60 text-sm">
                  Compare up to 4 gemstones side by side
                </p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={compareList.length >= 4}
                  className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gemstone
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-cosmic-dark border-cosmic-gold/30 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-cosmic-gold">Select Gemstone to Compare</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search gemstones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                  />
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-2 gap-3">
                      {availableProducts.map((product) => (
                        <Card
                          key={product.id}
                          className="bg-cosmic-dark/50 border-cosmic-gold/20 cursor-pointer hover:border-cosmic-gold/50 transition-colors"
                          onClick={() => addToCompare(product)}
                        >
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-cosmic-light text-sm font-medium truncate">
                                  {product.name}
                                </p>
                                <p className="text-cosmic-gold text-sm">
                                  ₹{product.price.toLocaleString()}
                                </p>
                                <Badge variant="outline" className="text-xs mt-1 border-cosmic-gold/30 text-cosmic-light">
                                  {product.gemstoneType}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Comparison Table */}
          {compareList.length === 0 ? (
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cosmic-gold/10 flex items-center justify-center">
                  <Plus className="h-10 w-10 text-cosmic-gold/50" />
                </div>
                <h3 className="text-xl font-semibold text-cosmic-light mb-2">
                  No Gemstones Selected
                </h3>
                <p className="text-cosmic-light/60 mb-6">
                  Add gemstones to compare their features, prices, and benefits side by side.
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Gemstone
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                {/* Product Headers */}
                <thead>
                  <tr>
                    <th className="p-4 text-left text-cosmic-light/60 font-medium min-w-[150px] bg-cosmic-dark/80 border-b border-cosmic-gold/20">
                      Feature
                    </th>
                    {compareList.map((product) => (
                      <th key={product.id} className="p-4 min-w-[250px] bg-cosmic-dark/80 border-b border-cosmic-gold/20">
                        <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full"
                            onClick={() => removeFromCompare(product.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <CardContent className="p-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h3 className="text-cosmic-light font-semibold text-sm mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                className="flex-1 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 text-xs"
                                onClick={() => addToCart(product)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`border-cosmic-gold/30 ${
                                  isInWishlist(product.id)
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'text-cosmic-gold hover:bg-cosmic-gold/10'
                                }`}
                                onClick={() => toggleWishlist(product.id)}
                              >
                                <Heart className={`h-3 w-3 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </th>
                    ))}
                    {compareList.length < 4 && (
                      <th className="p-4 min-w-[250px] bg-cosmic-dark/80 border-b border-cosmic-gold/20">
                        <Card
                          className="bg-cosmic-dark/30 border-cosmic-gold/20 border-dashed cursor-pointer hover:border-cosmic-gold/50 transition-colors"
                          onClick={() => setDialogOpen(true)}
                        >
                          <CardContent className="p-4 h-[220px] flex flex-col items-center justify-center">
                            <Plus className="h-8 w-8 text-cosmic-gold/50 mb-2" />
                            <p className="text-cosmic-light/50 text-sm">Add Gemstone</p>
                          </CardContent>
                        </Card>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Comparison Rows */}
                <tbody>
                  {comparisonFields.map((field, index) => (
                    <tr key={field.key} className={index % 2 === 0 ? 'bg-cosmic-dark/40' : 'bg-cosmic-dark/20'}>
                      <td className="p-4 text-cosmic-light/80 font-medium border-b border-cosmic-gold/10">
                        {field.label}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 text-cosmic-light text-center border-b border-cosmic-gold/10">
                          {field.format(product)}
                        </td>
                      ))}
                      {compareList.length < 4 && (
                        <td className="p-4 border-b border-cosmic-gold/10"></td>
                      )}
                    </tr>
                  ))}

                  {/* Benefits Row */}
                  <tr className="bg-cosmic-dark/40">
                    <td className="p-4 text-cosmic-light/80 font-medium border-b border-cosmic-gold/10">
                      Benefits
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-cosmic-gold/10">
                        <div className="space-y-1">
                          {product.benefits.slice(0, 4).map((benefit, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-cosmic-light">
                              <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                    {compareList.length < 4 && (
                      <td className="p-4 border-b border-cosmic-gold/10"></td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GemstoneCompare;
