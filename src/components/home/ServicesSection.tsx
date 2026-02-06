import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Heart, Video, Hand, Gem } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const ServicesSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: FileText,
      title: t('services.kundli.title'),
      description: t('services.kundli.desc'),
      path: '/free-kundli',
      gradient: 'from-cosmic-gold to-yellow-600',
    },
    {
      icon: Heart,
      title: t('services.matching.title'),
      description: t('services.matching.desc'),
      path: '/kundli-matching',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: Video,
      title: t('services.consultation.title'),
      description: t('services.consultation.desc'),
      path: '/consultation',
      gradient: 'from-cosmic-cyan to-blue-600',
    },
    {
      icon: Hand,
      title: t('services.palmReading.title'),
      description: t('services.palmReading.desc'),
      path: '/palm-reading',
      gradient: 'from-cosmic-purple to-purple-600',
    },
    {
      icon: Gem,
      title: t('services.gemstones.title'),
      description: t('services.gemstones.desc'),
      path: '/gemstone-store',
      gradient: 'from-emerald-500 to-green-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          <span className="text-gradient-gold">{t('services.title')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <Link 
              key={service.path} 
              to={service.path}
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="h-full bg-cosmic-dark/50 border-cosmic-gold/20 hover:border-cosmic-gold/50 transition-all duration-300 group-hover:scale-105 cosmic-glow overflow-hidden">
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${service.gradient} p-4 mb-4 group-hover:animate-glow-pulse`}>
                    <service.icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-cosmic-gold text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-cosmic-silver text-center text-sm">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
