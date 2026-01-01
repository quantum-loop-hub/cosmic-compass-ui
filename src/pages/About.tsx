import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Award, Users, Clock } from 'lucide-react';

const About = () => {
  const astrologers = [
    {
      name: 'Pandit Ramesh Sharma',
      specialty: 'Vedic Astrology',
      experience: '25+ years',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
      name: 'Acharya Deepak Joshi',
      specialty: 'Numerology & Vastu',
      experience: '20+ years',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
    {
      name: 'Jyotishacharya Meera Devi',
      specialty: 'Kundli Matching',
      experience: '18+ years',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-gradient-gold">About ASTRO VICHAR</span>
            </h1>
            <p className="text-cosmic-silver text-lg max-w-3xl mx-auto">
              We are dedicated to bringing you authentic Vedic astrology insights through modern technology. 
              Our platform combines ancient wisdom with AI-powered analysis to provide you with accurate 
              and personalized cosmic guidance.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Users, value: '50,000+', label: 'Happy Clients' },
              { icon: Star, value: '4.9/5', label: 'Average Rating' },
              { icon: Award, value: '100+', label: 'Expert Astrologers' },
              { icon: Clock, value: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <Card key={index} className="bg-cosmic-dark/50 border-cosmic-gold/20 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-10 h-10 text-cosmic-gold mx-auto mb-3" />
                  <div className="text-2xl font-bold text-cosmic-gold">{stat.value}</div>
                  <div className="text-cosmic-silver text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-gradient-gold">Our Story</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-cosmic-silver">
                <p>
                  Founded in 2020, ASTRO VICHAR was born from a vision to make authentic Vedic astrology 
                  accessible to everyone. We understood that in today's fast-paced world, people need 
                  quick yet accurate cosmic guidance.
                </p>
                <p>
                  Our team of experienced astrologers, combined with cutting-edge AI technology, brings 
                  you the best of both worlds - the depth of traditional Vedic knowledge and the 
                  convenience of modern technology.
                </p>
                <p>
                  Every Kundli we generate, every consultation we provide, is rooted in authentic 
                  Vedic principles passed down through generations of learned astrologers.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cosmic-gold/20 to-cosmic-purple/20 rounded-lg blur-xl" />
                <img 
                  src="https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=600&h=400&fit=crop" 
                  alt="Cosmic stars"
                  className="relative rounded-lg w-full"
                />
              </div>
            </div>
          </div>

          {/* Astrologers */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-gradient-gold">Meet Our Astrologers</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {astrologers.map((astrologer, index) => (
                <Card key={index} className="bg-cosmic-dark/50 border-cosmic-gold/20 overflow-hidden group hover:border-cosmic-gold/50 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-gold rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                      <img 
                        src={astrologer.image} 
                        alt={astrologer.name}
                        className="relative w-full h-full rounded-full object-cover border-2 border-cosmic-gold"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-cosmic-gold">{astrologer.name}</h3>
                    <p className="text-cosmic-cyan">{astrologer.specialty}</p>
                    <p className="text-cosmic-silver text-sm">{astrologer.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
