import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const zodiacSigns = [
  { name: 'Aries', nameHi: 'मेष', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', nameHi: 'वृषभ', symbol: '♉', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', nameHi: 'मिथुन', symbol: '♊', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', nameHi: 'कर्क', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', nameHi: 'सिंह', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', nameHi: 'कन्या', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', nameHi: 'तुला', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', nameHi: 'धनु', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', nameHi: 'मकर', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', nameHi: 'कुंभ', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', nameHi: 'मीन', symbol: '♓', dates: 'Feb 19 - Mar 20' },
];

const HoroscopeSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cosmic-darker/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          <span className="text-gradient-gold">{t('horoscope.title')}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {zodiacSigns.map((sign, index) => (
            <Link 
              key={sign.name}
              to={`/horoscope/${sign.name.toLowerCase()}`}
              className="block"
            >
              <Card 
                className="bg-cosmic-dark/50 border-cosmic-gold/20 hover:border-cosmic-gold/50 transition-all duration-300 hover:scale-105 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="text-center pb-2 pt-4">
                  <div className="text-4xl mb-2 group-hover:animate-glow-pulse">{sign.symbol}</div>
                  <CardTitle className="text-cosmic-gold text-sm">
                    {language === 'hi' ? sign.nameHi : sign.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-4">
                  <p className="text-cosmic-silver text-xs">{sign.dates}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-xs text-cosmic-cyan hover:text-cosmic-gold"
                  >
                    {t('horoscope.readMore')}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HoroscopeSection;
