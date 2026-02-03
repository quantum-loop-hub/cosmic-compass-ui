import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Award, Users, Languages, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const astrologers = [
    {
      name: 'Pandit Ramesh Sharma',
      email: 'ramesh.sharma@astrovichar.com',
      specialties: ['Vedic Astrology', 'Kundli Analysis', 'Marriage Guidance'],
      experience: 25,
      rating: 4.9,
      consultations: 12000,
      languages: ['Hindi', 'English'],
      bio: 'Expert Vedic astrologer with decades of experience in Kundli analysis, marriage matching, and life guidance.',
      image: 'src/assets/astrovichar.png',
      calLink: 'https://cal.id/astro-vichar',
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
                  Founded in 2025, ASTRO VICHAR was born from a vision to make authentic Vedic astrology
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
            <h2 className="text-3xl font-bold text-center mb-10">
              <span className="text-gradient-gold">Meet Our Astrologers</span>
            </h2>
            <div className="flex justify-center">

              <div className="w-full max-w-3xl">
                {astrologers.map((astrologer, index) => (
                  <Card
                    key={index}
                    className="bg-cosmic-dark/50 border-cosmic-gold/30 backdrop-blur-sm overflow-hidden hover:border-cosmic-gold/60 transition-all"
                  >
                    <CardContent className="p-6 flex flex-col sm:flex-row gap-6">

                      {/* Left – Profile Image */}
                      <div className="flex-shrink-0 flex justify-center">
                        <div className="relative">
                          <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-cosmic-gold overflow-hidden glow-gold">
                            <img
                              src={astrologer.image}
                              alt={astrologer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right – Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-cosmic-gold">
                              {astrologer.name}
                            </h3>
                            <p className="text-cosmic-cyan text-sm">
                              {astrologer.specialties[0]}
                            </p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                            Available
                          </Badge>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 text-sm mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(astrologer.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-cosmic-silver'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-cosmic-gold font-semibold">
                            {astrologer.rating}
                          </span>
                          <span className="text-cosmic-silver">
                            • {astrologer.consultations.toLocaleString()}+ consultations
                          </span>
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {astrologer.specialties.map((s) => (
                            <Badge
                              key={s}
                              variant="outline"
                              className="border-cosmic-gold/30 text-cosmic-cyan text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          <span className="flex items-center gap-2 text-cosmic-silver">
                            <Clock className="w-4 h-4 text-cosmic-gold" />
                            {astrologer.experience}+ years
                          </span>
                          <span className="flex items-center gap-2 text-cosmic-silver">
                            <Languages className="w-4 h-4 text-cosmic-gold" />
                            {astrologer.languages.join(', ')}
                          </span>
                        </div>

                        {/* Bio */}
                        <p className="text-cosmic-silver text-sm mb-4 line-clamp-3">
                          {astrologer.bio}
                        </p>

                        {/* CTA */}
                        <Button
                          onClick={() => window.open(astrologer.calLink, '_blank')}
                          className="bg-gradient-to-r from-cosmic-gold to-cosmic-gold/80 text-black font-semibold hover:opacity-90"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Consultation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default About;
