import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star, Globe, Wallet, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/free-kundli', label: t('nav.freeKundli') },
    { path: '/calculators', label: t('nav.calculators') },
    { path: '/consultation', label: t('nav.consultation') },
    { path: '/gemstone-store', label: t('nav.gemstoneStore') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cosmic-dark/90 backdrop-blur-md border-b border-cosmic-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dc95e31uf/image/upload/v1769684680/cosmic-logo_wtdgjd.jpg"
                alt="Astro Vichar Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="absolute inset-0 bg-cosmic-gold/30 blur-lg rounded-full" />
            </div>
            <span className="text-xl font-bold text-gradient-gold">ASTRO VICHAR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.path)
                    ? "text-cosmic-gold bg-cosmic-gold/10"
                    : "text-cosmic-silver hover:text-cosmic-gold hover:bg-cosmic-gold/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-cosmic-silver hover:text-cosmic-gold"
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === 'en' ? 'हिंदी' : 'EN'}
            </Button>

            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-cosmic-silver hover:text-cosmic-gold">
                    <UserCircle className="w-4 h-4 mr-1" />
                    Profile
                  </Button>
                </Link>
                <Link to="/my-wallet">
                  <Button variant="ghost" size="sm" className="text-cosmic-silver hover:text-cosmic-gold">
                    <Wallet className="w-4 h-4 mr-1" />
                    My Wallet
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10">
                      {t('nav.admin')}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-cosmic-silver hover:text-cosmic-gold"
                >
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold">
                  {t('nav.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-cosmic-silver hover:text-cosmic-gold"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-cosmic-gold/20 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(link.path)
                      ? "text-cosmic-gold bg-cosmic-gold/10"
                      : "text-cosmic-silver hover:text-cosmic-gold hover:bg-cosmic-gold/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center gap-2 px-4 pt-4 border-t border-cosmic-gold/20 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="text-cosmic-silver hover:text-cosmic-gold"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  {language === 'en' ? 'हिंदी' : 'EN'}
                </Button>
                
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="text-cosmic-silver hover:text-cosmic-gold">
                        <UserCircle className="w-4 h-4 mr-1" />
                        Profile
                      </Button>
                    </Link>
                    <Link to="/my-wallet" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="text-cosmic-silver hover:text-cosmic-gold">
                        <Wallet className="w-4 h-4 mr-1" />
                        My Wallet
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="text-cosmic-silver hover:text-cosmic-gold"
                    >
                      {t('nav.logout')}
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold">
                      {t('nav.login')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
