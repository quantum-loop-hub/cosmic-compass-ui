import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'The Kundli matching service helped me find the perfect life partner. The predictions were incredibly accurate!', textHi: 'कुंडली मिलान सेवा ने मुझे सही जीवनसाथी खोजने में मदद की। भविष्यवाणियां अविश्वसनीय रूप से सटीक थीं!' },
  { name: 'Rajesh Kumar', location: 'Delhi', rating: 5, text: "Pandit ji's consultation was life-changing. His guidance on career decisions was spot on.", textHi: 'पंडित जी का परामर्श जीवन बदलने वाला था। करियर के फैसलों पर उनका मार्गदर्शन बिल्कुल सही था।' },
  { name: 'Anita Patel', location: 'Ahmedabad', rating: 5, text: 'The gemstone recommendation based on my birth chart has brought positive changes in my life.', textHi: 'मेरी जन्म कुंडली के आधार पर रत्न की सिफारिश ने मेरे जीवन में सकारात्मक बदलाव लाए हैं।' },
  { name: 'Vikram Singh', location: 'Jaipur', rating: 5, text: 'The AI palm reading was surprisingly accurate. Highly recommend their services!', textHi: 'AI हस्तरेखा पठन आश्चर्यजनक रूप से सटीक था। उनकी सेवाओं की अत्यधिक अनुशंसा करता हूं!' },
];

const TestimonialsSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gradient-gold">{t('testimonials.title')}</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <Card className="h-full bg-cosmic-dark/50 border-cosmic-gold/20 hover:border-cosmic-gold/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <Quote className="w-8 h-8 text-cosmic-gold/50 mb-4" />
                  <p className="text-cosmic-silver text-sm mb-4">
                    {language === 'hi' ? testimonial.textHi : testimonial.text}
                  </p>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-cosmic-gold text-cosmic-gold" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-cosmic-gold">{testimonial.name}</p>
                    <p className="text-cosmic-silver text-xs">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
