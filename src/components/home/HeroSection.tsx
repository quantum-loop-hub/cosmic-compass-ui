import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cosmic-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cosmic-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative element */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-cosmic-gold animate-glow-pulse" />
            <div className="absolute inset-0 bg-cosmic-gold/30 blur-xl rounded-full" />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          <span className="text-gradient-gold">{t('hero.title')}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-cosmic-silver max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {t('hero.subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link to="/consultation">
            <Button 
              size="lg" 
              className="bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold px-8 py-6 text-lg group"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              {t('hero.cta.consultation')}
            </Button>
          </Link>
          <Link to="/free-kundli">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold/10 px-8 py-6 text-lg cosmic-border"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('hero.cta.freeKundli')}
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-cosmic-silver animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-cosmic-gold">50K+</div>
            <div className="text-sm">Kundlis Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cosmic-gold">10K+</div>
            <div className="text-sm">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cosmic-gold">100+</div>
            <div className="text-sm">Expert Astrologers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cosmic-gold">4.9★</div>
            <div className="text-sm">Client Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
