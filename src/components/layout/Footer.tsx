import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { path: '/free-kundli', label: t('nav.freeKundli') },
    { path: '/kundli-matching', label: t('nav.kundliMatching') },
    { path: '/consultation', label: t('nav.consultation') },
    { path: '/gemstone-store', label: t('nav.gemstoneStore') },
    { path: '/palm-reading', label: t('nav.palmReading') },
  ];

  return (
    <footer className="relative bg-cosmic-darker border-t border-cosmic-gold/20">
      {/* Starfield effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Star className="w-8 h-8 text-cosmic-gold animate-twinkle" />
              <span className="text-xl font-bold text-gradient-gold">ASTRO VICHAR</span>
            </Link>
            <p className="text-cosmic-silver text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cosmic-gold font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-cosmic-silver hover:text-cosmic-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cosmic-gold font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-cosmic-silver text-sm">
                <Phone className="w-4 h-4 text-cosmic-gold" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-cosmic-silver text-sm">
                <Mail className="w-4 h-4 text-cosmic-gold" />
                contact@astrovichar.com
              </li>
              <li className="flex items-start gap-2 text-cosmic-silver text-sm">
                <MapPin className="w-4 h-4 text-cosmic-gold mt-0.5" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h3 className="text-cosmic-gold font-semibold mb-4">{t('footer.whatsapp')}</h3>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-cosmic-gold/20 text-center">
          <p className="text-cosmic-silver text-sm">
            © {new Date().getFullYear()} ASTRO VICHAR. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
