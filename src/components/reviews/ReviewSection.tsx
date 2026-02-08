import React, { useState, useEffect } from 'react';
import { Star, Send, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  reviewer_name: string | null;
  created_at: string;
}

interface ReviewSectionProps {
  type: 'consultation' | 'gemstone';
  itemId?: string;
  title?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ type, itemId, title = 'Reviews & Ratings' }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const fetchReviews = async () => {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (itemId) query = query.eq('item_id', itemId);

    const { data, error } = await query;
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [type, itemId]);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Login Required', description: 'Please log in to leave a review.', variant: 'destructive' });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Rating Required', description: 'Please select a star rating.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      type,
      item_id: itemId || null,
      rating,
      review_text: reviewText.trim() || null,
      reviewer_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    } as any);

    if (error) {
      toast({ title: 'Error', description: 'Failed to submit review.', variant: 'destructive' });
    } else {
      toast({ title: 'Thank you!', description: 'Your review has been submitted.' });
      setRating(0);
      setReviewText('');
      fetchReviews();
    }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast({ title: 'Deleted', description: 'Review removed.' });
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const userHasReviewed = user && reviews.some(r => r.user_id === user.id);

  return (
    <div className="space-y-6">
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center justify-between">
            <span>{title}</span>
            <span className="flex items-center gap-2 text-base">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              {avgRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Write Review */}
          {!userHasReviewed && (
            <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border space-y-3">
              <p className="text-sm font-medium text-foreground">Write a Review</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience (optional)..."
                className="bg-white text-black placeholder:text-gray-400 min-h-[80px]"
                maxLength={500}
              />
              <Button onClick={handleSubmit} disabled={submitting || rating === 0} className="btn-cosmic">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Submit Review
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="flex gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      {(review.reviewer_name || '?')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{review.reviewer_name || 'User'}</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                        {user?.id === review.user_id && (
                          <button onClick={() => handleDelete(review.id)} className="ml-2 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {review.review_text && (
                      <p className="text-sm text-muted-foreground mt-1">{review.review_text}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSection;
