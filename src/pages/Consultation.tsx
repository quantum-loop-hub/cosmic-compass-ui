import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Video, Clock, Languages, Calendar } from 'lucide-react';

const mockAstrologers = [
  {
    id: '1',
    name: 'Pandit Ramesh Sharma',
    specialties: ['Vedic Astrology', 'Career', 'Marriage'],
    experience: 25,
    rating: 4.9,
    consultations: 5000,
    pricePerMinute: 20,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    languages: ['Hindi', 'English'],
    isAvailable: true,
    bio: 'Expert in Vedic astrology with 25+ years of experience. Specializes in career guidance and marriage compatibility.',
  },
  {
    id: '2',
    name: 'Acharya Deepak Joshi',
    specialties: ['Numerology', 'Vastu', 'Gemstones'],
    experience: 20,
    rating: 4.8,
    consultations: 3500,
    pricePerMinute: 25,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    languages: ['Hindi', 'English', 'Marathi'],
    isAvailable: true,
    bio: 'Renowned numerologist and Vastu expert. Has helped thousands find success through cosmic guidance.',
  },
  {
    id: '3',
    name: 'Jyotishacharya Meera Devi',
    specialties: ['Kundli Matching', 'Love & Relationships', 'Health'],
    experience: 18,
    rating: 4.9,
    consultations: 4200,
    pricePerMinute: 22,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    languages: ['Hindi', 'English', 'Gujarati'],
    isAvailable: false,
    bio: 'Specialized in relationship astrology and kundli matching. Compassionate advisor for life decisions.',
  },
  {
    id: '4',
    name: 'Dr. Suresh Pandey',
    specialties: ['Medical Astrology', 'Remedies', 'Puja'],
    experience: 30,
    rating: 4.7,
    consultations: 8000,
    pricePerMinute: 30,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    languages: ['Hindi', 'Sanskrit', 'English'],
    isAvailable: true,
    bio: 'PhD in Jyotish Shastra. Expert in medical astrology and traditional remedies for health issues.',
  },
];

const Consultation = () => {
  const [selectedAstrologer, setSelectedAstrologer] = useState<string | null>(null);

  const handleBooking = (astrologerId: string) => {
    setSelectedAstrologer(astrologerId);
    // In real implementation, this would open a booking modal with calendar
    alert('Booking functionality will be implemented with Razorpay integration. Connect Supabase first!');
  };

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Video className="w-16 h-16 text-cosmic-gold" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Live Consultation</span>
            </h1>
            <p className="text-cosmic-silver max-w-2xl mx-auto">
              Connect with our expert astrologers via video call. Get personalized guidance 
              for your life's important decisions from the comfort of your home.
            </p>
          </div>

          {/* Astrologer Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {mockAstrologers.map((astrologer) => (
              <Card 
                key={astrologer.id} 
                className="bg-cosmic-dark/50 border-cosmic-gold/30 hover:border-cosmic-gold/50 transition-all"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={astrologer.avatar} 
                        alt={astrologer.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-cosmic-gold"
                      />
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-cosmic-dark ${
                        astrologer.isAvailable ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-cosmic-gold">{astrologer.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-cosmic-silver">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{astrologer.rating}</span>
                            <span>•</span>
                            <span>{astrologer.consultations}+ consultations</span>
                          </div>
                        </div>
                        <Badge variant={astrologer.isAvailable ? 'default' : 'secondary'} className={
                          astrologer.isAvailable 
                            ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                            : 'bg-gray-500/20 text-gray-400'
                        }>
                          {astrologer.isAvailable ? 'Available' : 'Busy'}
                        </Badge>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {astrologer.specialties.map((s) => (
                          <Badge key={s} variant="outline" className="border-cosmic-gold/30 text-cosmic-cyan text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-cosmic-silver">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {astrologer.experience} years
                        </span>
                        <span className="flex items-center gap-1">
                          <Languages className="w-4 h-4" />
                          {astrologer.languages.join(', ')}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-cosmic-silver text-sm mt-2 line-clamp-2">
                        {astrologer.bio}
                      </p>

                      {/* Price & Book */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-cosmic-gold/20">
                        <div>
                          <span className="text-cosmic-gold font-bold text-xl">₹{astrologer.pricePerMinute}</span>
                          <span className="text-cosmic-silver text-sm">/min</span>
                        </div>
                        <Button
                          onClick={() => handleBooking(astrologer.id)}
                          disabled={!astrologer.isAvailable}
                          className="bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="text-gradient-gold">How It Works</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Choose Astrologer', desc: 'Browse our experts and select one that matches your needs' },
                { step: 2, title: 'Book a Slot', desc: 'Pick a convenient time from the available calendar slots' },
                { step: 3, title: 'Make Payment', desc: 'Secure payment via Razorpay with UPI, cards, or wallets' },
                { step: 4, title: 'Join Video Call', desc: 'Get your meeting link and connect at the scheduled time' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold text-cosmic-dark font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-cosmic-gold font-semibold mb-2">{item.title}</h3>
                  <p className="text-cosmic-silver text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Consultation;
