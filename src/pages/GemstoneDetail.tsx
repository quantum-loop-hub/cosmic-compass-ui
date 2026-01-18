import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowLeft, 
  Shield, 
  Truck, 
  Award,
  Sparkles
} from 'lucide-react';
import { useGemstoneStore } from '@/hooks/useGemstoneStore';

const GemstoneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProductById, 
    getRelatedProducts, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    formatPrice 
  } = useGemstoneStore();

  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Gemstone Not Found</h1>
            <p className="text-muted-foreground mb-6">The gemstone you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/gemstone-store')} className="bg-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedProducts = getRelatedProducts(product);
  const inWishlist = isInWishlist(product.id);

  return (
    <Layout>
      <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/gemstone-store')}
            className="mb-6 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-primary/30">
                <img
                  src={product.image.replace('w=400&h=400', 'w=800&h=800')}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-destructive/80 text-destructive-foreground text-lg px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className={`absolute top-4 right-4 rounded-full ${
                  inWishlist 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                    : 'bg-white/80 hover:bg-white'
                }`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm px-3 py-1">
                {product.category}
              </Badge>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{product.caratWeight} Carats</span>
                  <span>•</span>
                  <span>Origin: {product.origin}</span>
                </div>
              </div>

              <div className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                {formatPrice(product.price)}
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Astrological Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit) => (
                    <Badge key={benefit} variant="outline" className="border-accent/50 text-accent px-3 py-1">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Planet & Zodiac */}
              {(product.planet || product.zodiacSigns) && (
                <div className="mb-6 bg-card/50 border border-primary/20 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.planet && (
                      <div>
                        <p className="text-sm text-muted-foreground">Associated Planet</p>
                        <p className="font-semibold text-foreground">{product.planet}</p>
                      </div>
                    )}
                    {product.zodiacSigns && (
                      <div>
                        <p className="text-sm text-muted-foreground">Zodiac Signs</p>
                        <p className="font-semibold text-foreground">{product.zodiacSigns.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`flex-1 ${inWishlist ? 'border-red-500 text-red-500' : 'border-primary/50 text-primary'}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`w-5 h-5 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-primary/20">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">100% Authentic</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Award className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Lab Certified</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Free Shipping</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <h2 className="text-2xl font-bold text-primary mb-6">Related Gemstones</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/gemstone/${relatedProduct.id}`}>
                    <Card className="bg-card/50 border-primary/30 hover:border-primary/50 transition-all overflow-hidden group h-full">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {!relatedProduct.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge variant="secondary" className="bg-destructive/80 text-destructive-foreground text-xs">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-primary mb-1 line-clamp-1 text-sm">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{relatedProduct.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GemstoneDetail;
