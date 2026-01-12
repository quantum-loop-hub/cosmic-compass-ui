import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Video, Clock, Languages, Calendar, Mail, Play } from 'lucide-react';
import { useState } from 'react';
import astrologerImage from '@/assets/astrovichar.png';

const astrologer = {
  name: 'Astro Vichar',
  email: 'astrovichar8@gmail.com',
  specialties: ['Vedic Astrology', 'Kundli Analysis', 'Career Guidance', 'Marriage Compatibility', 'Gemstone Consultation'],
  experience: 15,
  rating: 4.9,
  consultations: 5000,
  languages: ['Hindi', 'English'],
  bio: 'Welcome to Astro Vichar! With over 15 years of experience in Vedic Astrology, I provide personalized guidance for life\'s important decisions. From career and relationships to health and prosperity, get accurate predictions and effective remedies tailored just for you.',
  calLink: 'https://cal.com/astro-vichar',
};

const Consultation = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleBooking = () => {
    window.open(astrologer.calLink, '_blank');
  };

  return (
    <Layout>
      <div className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4">
              <Video className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Book a Consultation</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Get personalized astrological guidance via video call. Connect from the comfort of your home.
            </p>
          </div>

          {/* Astrologer Profile Card */}
          <Card className="bg-card/50 border-primary/30 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Left Side - Photo & Video */}
                <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  {/* Circular Profile Image */}
                  <div className="relative mb-6">
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full border-4 border-primary overflow-hidden glow-gold">
                      <img 
                        src={astrologerImage} 
                        alt="Astro Vichar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-card" title="Available" />
                  </div>

                  {/* Intro Video Section */}
                  <div className="w-full max-w-sm">
                    <Button
                      onClick={() => setShowVideo(!showVideo)}
                      variant="outline"
                      className="w-full border-primary/50 text-primary hover:bg-primary/10 gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {showVideo ? 'Hide Intro Video' : 'Watch Intro Video'}
                    </Button>
                    
                    {showVideo && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-primary/30 aspect-[9/16] max-h-[400px] bg-muted">
                        <video 
                          src="/videos/intro-astro.mp4"
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="lg:w-3/5 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-primary">{astrologer.name}</h2>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${astrologer.email}`} className="hover:text-primary transition-colors text-sm sm:text-base">
                          {astrologer.email}
                        </a>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 self-start">
                      Available
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(astrologer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-primary font-semibold">{astrologer.rating}</span>
                    <span className="text-muted-foreground">• {astrologer.consultations.toLocaleString()}+ consultations</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {astrologer.specialties.map((s) => (
                      <Badge key={s} variant="outline" className="border-primary/30 text-accent text-xs sm:text-sm">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {astrologer.experience}+ years experience
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Languages className="w-4 h-4 text-primary" />
                      {astrologer.languages.join(', ')}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
                    {astrologer.bio}
                  </p>

                  {/* Book Button */}
                  <Button
                    onClick={handleBooking}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground font-semibold glow-gold"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
              <span className="text-gradient-gold">How It Works</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: 1, title: 'Choose a Time', desc: 'Select a convenient slot from the calendar' },
                { step: 2, title: 'Fill Details', desc: 'Provide your birth details for accurate reading' },
                { step: 3, title: 'Confirm Booking', desc: 'Complete the booking process' },
                { step: 4, title: 'Join Video Call', desc: 'Get Google Meet link and connect at scheduled time' },
              ].map((item) => (
                <div key={item.step} className="text-center p-4 cosmic-card-hover rounded-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-lg sm:text-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-primary font-semibold mb-2 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">
              Have questions? Reach out at{' '}
              <a href={`mailto:${astrologer.email}`} className="text-primary hover:underline">
                {astrologer.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Consultation;
