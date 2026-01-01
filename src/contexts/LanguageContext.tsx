import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.freeKundli': 'Free Kundli',
    'nav.kundliMatching': 'Kundli Matching',
    'nav.calculators': 'Calculators',
    'nav.consultation': 'Consultation',
    'nav.gemstoneStore': 'Gemstone Store',
    'nav.palmReading': 'Palm Reading',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    
    // Hero
    'hero.title': 'Discover Your Cosmic Destiny',
    'hero.subtitle': 'Unlock the secrets of the stars with authentic Vedic astrology consultations and personalized guidance',
    'hero.cta.consultation': 'Book Consultation',
    'hero.cta.freeKundli': 'Free Kundli',
    
    // Services
    'services.title': 'Our Services',
    'services.kundli.title': 'Kundli Generation',
    'services.kundli.desc': 'Get your detailed birth chart with AI-powered interpretations',
    'services.matching.title': 'Kundli Matching',
    'services.matching.desc': 'Find your perfect match with comprehensive compatibility analysis',
    'services.consultation.title': 'Live Consultation',
    'services.consultation.desc': 'Connect with expert astrologers via video call',
    'services.palmReading.title': 'AI Palm Reading',
    'services.palmReading.desc': 'Upload your palm image for instant AI analysis',
    'services.gemstones.title': 'Gemstone Store',
    'services.gemstones.desc': 'Certified gemstones recommended for your birth chart',
    
    // Horoscope
    'horoscope.title': 'Daily Horoscope',
    'horoscope.readMore': 'Read More',
    
    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    
    // Footer
    'footer.tagline': 'Your trusted partner in cosmic guidance',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.whatsapp': 'WhatsApp Us',
    'footer.rights': 'All rights reserved',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.share': 'Share',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.freeKundli': 'मुफ्त कुंडली',
    'nav.kundliMatching': 'कुंडली मिलान',
    'nav.calculators': 'कैलकुलेटर',
    'nav.consultation': 'परामर्श',
    'nav.gemstoneStore': 'रत्न दुकान',
    'nav.palmReading': 'हस्तरेखा',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.admin': 'एडमिन',
    
    // Hero
    'hero.title': 'अपनी ब्रह्मांडीय नियति खोजें',
    'hero.subtitle': 'प्रामाणिक वैदिक ज्योतिष परामर्श और व्यक्तिगत मार्गदर्शन के साथ सितारों के रहस्यों को खोलें',
    'hero.cta.consultation': 'परामर्श बुक करें',
    'hero.cta.freeKundli': 'मुफ्त कुंडली',
    
    // Services
    'services.title': 'हमारी सेवाएं',
    'services.kundli.title': 'कुंडली निर्माण',
    'services.kundli.desc': 'AI-संचालित व्याख्याओं के साथ अपनी विस्तृत जन्म कुंडली प्राप्त करें',
    'services.matching.title': 'कुंडली मिलान',
    'services.matching.desc': 'व्यापक अनुकूलता विश्लेषण के साथ अपना सही मैच खोजें',
    'services.consultation.title': 'लाइव परामर्श',
    'services.consultation.desc': 'वीडियो कॉल के माध्यम से विशेषज्ञ ज्योतिषियों से जुड़ें',
    'services.palmReading.title': 'AI हस्तरेखा',
    'services.palmReading.desc': 'तत्काल AI विश्लेषण के लिए अपनी हथेली की छवि अपलोड करें',
    'services.gemstones.title': 'रत्न दुकान',
    'services.gemstones.desc': 'आपकी जन्म कुंडली के लिए अनुशंसित प्रमाणित रत्न',
    
    // Horoscope
    'horoscope.title': 'दैनिक राशिफल',
    'horoscope.readMore': 'और पढ़ें',
    
    // Testimonials
    'testimonials.title': 'हमारे ग्राहक क्या कहते हैं',
    
    // Footer
    'footer.tagline': 'ब्रह्मांडीय मार्गदर्शन में आपका विश्वसनीय साथी',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.contact': 'संपर्क करें',
    'footer.whatsapp': 'व्हाट्सएप करें',
    'footer.rights': 'सर्वाधिकार सुरक्षित',
    
    // Auth
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूरा नाम',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.hasAccount': 'पहले से खाता है?',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'एक त्रुटि हुई',
    'common.success': 'सफलता!',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.download': 'डाउनलोड',
    'common.share': 'शेयर',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('astro-vichar-language') as Language;
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('astro-vichar-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
