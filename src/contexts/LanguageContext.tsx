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
    
    // Calculators Page
    'calc.title': 'Astrology Calculators',
    'calc.subtitle': 'Discover your lucky numbers, gemstones, planetary periods, and more with our free calculators.',
    'calc.numerology': 'Numerology',
    'calc.panchang': 'Panchang',
    'calc.dasha': 'Dasha',
    'calc.sunSign': 'Sun Sign',
    'calc.gemstone': 'Gemstone',
    'calc.kundliMatching': 'Kundli Matching',
    'calc.palmReading': 'Palm Reading',
    'calc.gunMilan': 'Gun Milan compatibility',
    'calc.aiPalmistry': 'AI palmistry analysis',
    'calc.calculate': 'Calculate',
    'calc.findMySign': 'Find My Sign',
    'calc.findGemstone': 'Find Gemstone',
    'calc.getPanchang': 'Get Panchang',
    'calc.calculateDasha': 'Calculate Dasha',
    'calc.enterDetails': 'Enter your details to see results',
    
    // Numerology
    'num.title': 'Calculate Your Numbers',
    'num.desc': 'Enter your details to find your numerology profile',
    'num.fullName': 'Full Name',
    'num.birthDate': 'Birth Date',
    'num.resultTitle': 'Your Numerology Profile',
    'num.lifePath': 'Life Path',
    'num.destiny': 'Destiny',
    'num.luckyNumbers': 'Lucky Numbers',
    'num.luckyColors': 'Lucky Colors',
    'num.whatIs': 'What is Numerology?',
    'num.summary': 'Numerology is the ancient study of numbers and their mystical significance in our lives. Each number from 1-9 carries unique vibrations and meanings that influence personality, destiny, and life events.',
    
    // Panchang
    'pnc.title': "Today's Panchang",
    'pnc.desc': 'Get detailed Panchang for your location',
    'pnc.location': 'Your Location',
    'pnc.resultTitle': 'Panchang Details',
    'pnc.tithi': 'Tithi',
    'pnc.nakshatra': 'Nakshatra',
    'pnc.yoga': 'Yoga',
    'pnc.karana': 'Karana',
    'pnc.sunrise': 'Sunrise',
    'pnc.sunset': 'Sunset',
    'pnc.rahuKaal': 'Rahu Kaal',
    'pnc.gulikaKaal': 'Gulika Kaal',
    'pnc.auspicious': 'Auspicious Day for Important Work',
    'pnc.notAuspicious': 'Avoid Starting New Ventures Today',
    'pnc.whatIs': 'What is Panchang?',
    'pnc.summary': 'Panchang is the Hindu calendar and almanac that provides five key elements: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (sun-moon angle), Karana (half of tithi), and Vara (weekday). It helps determine auspicious times for important activities.',
    
    // Dasha
    'dsh.title': 'Calculate Your Dasha',
    'dsh.desc': 'Find your current and upcoming planetary periods',
    'dsh.birthTime': 'Birth Time (Optional)',
    'dsh.resultTitle': 'Your Dasha Periods',
    'dsh.currentMahadasha': 'Current Mahadasha',
    'dsh.nextMahadasha': 'Next Mahadasha',
    'dsh.yearsRemaining': 'years remaining',
    'dsh.yearsPeriod': 'years period',
    'dsh.sequence': 'Mahadasha Sequence:',
    'dsh.whatIs': 'What is Dasha?',
    'dsh.summary': 'Dasha is the planetary period system in Vedic astrology. The Vimshottari Dasha divides 120 years into periods ruled by different planets. Each Mahadasha influences different aspects of life based on the ruling planet.',
    
    // Sun Sign
    'sun.title': 'Discover Your Sun Sign',
    'sun.desc': 'Enter your birth date to find your zodiac sign',
    'sun.resultTitle': 'Your Sun Sign',
    'sun.element': 'Element',
    'sun.rulingPlanet': 'Ruling Planet',
    'sun.keyTraits': 'Key Traits',
    'sun.readHoroscope': "Read Today's Horoscope",
    'sun.whatIs': 'What is Sun Sign?',
    'sun.summary': 'Your Sun Sign is determined by the position of the Sun at your birth and represents your core personality, ego, and life purpose. It is the most fundamental aspect of your astrological identity.',
    
    // Gemstone
    'gem.title': 'Find Your Gemstone',
    'gem.desc': 'Discover the gemstone that aligns with your birth chart',
    'gem.resultTitle': 'Your Recommended Gemstone',
    'gem.planet': 'Planet',
    'gem.color': 'Color',
    'gem.benefits': 'Benefits',
    'gem.browseStore': 'Browse Gemstone Store',
    'gem.whatIs': 'What are Astrological Gemstones?',
    'gem.summary': 'Astrological gemstones are precious and semi-precious stones associated with planets. Wearing the right gemstone can strengthen beneficial planetary influences and reduce negative effects in your birth chart.',
    
    // Consultation Page
    'consult.title': 'Book a Consultation',
    'consult.subtitle': 'Get personalized astrological guidance via video call. Connect from the comfort of your home.',
    'consult.available': 'Available',
    'consult.consultations': 'consultations',
    'consult.experience': 'years experience',
    'consult.schedule': 'Schedule Consultation',
    'consult.watchVideo': 'Watch Intro Video',
    'consult.hideVideo': 'Hide Intro Video',
    'consult.howItWorks': 'How It Works',
    'consult.step1': 'Choose a Time',
    'consult.step1Desc': 'Select a convenient slot from the calendar',
    'consult.step2': 'Fill Details',
    'consult.step2Desc': 'Provide your birth details for accurate reading',
    'consult.step3': 'Confirm Booking',
    'consult.step3Desc': 'Complete the booking process',
    'consult.step4': 'Join Video Call',
    'consult.step4Desc': 'Get Google Meet link and connect at scheduled time',
    'consult.questions': 'Have questions? Reach out at',
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
    
    // Calculators Page
    'calc.title': 'ज्योतिष कैलकुलेटर',
    'calc.subtitle': 'हमारे मुफ्त कैलकुलेटर से अपने भाग्यशाली अंक, रत्न, ग्रह दशा और बहुत कुछ जानें।',
    'calc.numerology': 'अंक ज्योतिष',
    'calc.panchang': 'पंचांग',
    'calc.dasha': 'दशा',
    'calc.sunSign': 'सूर्य राशि',
    'calc.gemstone': 'रत्न',
    'calc.kundliMatching': 'कुंडली मिलान',
    'calc.palmReading': 'हस्तरेखा',
    'calc.gunMilan': 'गुण मिलान अनुकूलता',
    'calc.aiPalmistry': 'AI हस्तरेखा विश्लेषण',
    'calc.calculate': 'गणना करें',
    'calc.findMySign': 'मेरी राशि खोजें',
    'calc.findGemstone': 'रत्न खोजें',
    'calc.getPanchang': 'पंचांग देखें',
    'calc.calculateDasha': 'दशा गणना करें',
    'calc.enterDetails': 'परिणाम देखने के लिए अपना विवरण दर्ज करें',
    
    // Numerology
    'num.title': 'अपने अंक गणना करें',
    'num.desc': 'अपनी अंक ज्योतिष प्रोफ़ाइल जानने के लिए विवरण दर्ज करें',
    'num.fullName': 'पूरा नाम',
    'num.birthDate': 'जन्म तिथि',
    'num.resultTitle': 'आपकी अंक ज्योतिष प्रोफ़ाइल',
    'num.lifePath': 'जीवन पथ',
    'num.destiny': 'भाग्य',
    'num.luckyNumbers': 'भाग्यशाली अंक',
    'num.luckyColors': 'भाग्यशाली रंग',
    'num.whatIs': 'अंक ज्योतिष क्या है?',
    'num.summary': 'अंक ज्योतिष संख्याओं और हमारे जीवन में उनके रहस्यमय महत्व का प्राचीन अध्ययन है। 1-9 तक प्रत्येक संख्या में अद्वितीय कंपन और अर्थ होते हैं जो व्यक्तित्व, भाग्य और जीवन की घटनाओं को प्रभावित करते हैं।',
    
    // Panchang
    'pnc.title': 'आज का पंचांग',
    'pnc.desc': 'अपने स्थान के लिए विस्तृत पंचांग प्राप्त करें',
    'pnc.location': 'आपका स्थान',
    'pnc.resultTitle': 'पंचांग विवरण',
    'pnc.tithi': 'तिथि',
    'pnc.nakshatra': 'नक्षत्र',
    'pnc.yoga': 'योग',
    'pnc.karana': 'करण',
    'pnc.sunrise': 'सूर्योदय',
    'pnc.sunset': 'सूर्यास्त',
    'pnc.rahuKaal': 'राहु काल',
    'pnc.gulikaKaal': 'गुलिका काल',
    'pnc.auspicious': 'महत्वपूर्ण कार्यों के लिए शुभ दिन',
    'pnc.notAuspicious': 'आज नए कार्य शुरू करने से बचें',
    'pnc.whatIs': 'पंचांग क्या है?',
    'pnc.summary': 'पंचांग हिंदू कैलेंडर और पंचांग है जो पांच प्रमुख तत्व प्रदान करता है: तिथि (चंद्र दिवस), नक्षत्र (चंद्र भवन), योग (सूर्य-चंद्र कोण), करण (तिथि का आधा), और वार (सप्ताह का दिन)। यह महत्वपूर्ण गतिविधियों के लिए शुभ समय निर्धारित करने में मदद करता है।',
    
    // Dasha
    'dsh.title': 'अपनी दशा गणना करें',
    'dsh.desc': 'अपनी वर्तमान और आगामी ग्रह अवधि जानें',
    'dsh.birthTime': 'जन्म समय (वैकल्पिक)',
    'dsh.resultTitle': 'आपकी दशा अवधि',
    'dsh.currentMahadasha': 'वर्तमान महादशा',
    'dsh.nextMahadasha': 'अगली महादशा',
    'dsh.yearsRemaining': 'वर्ष शेष',
    'dsh.yearsPeriod': 'वर्ष की अवधि',
    'dsh.sequence': 'महादशा क्रम:',
    'dsh.whatIs': 'दशा क्या है?',
    'dsh.summary': 'दशा वैदिक ज्योतिष में ग्रह अवधि प्रणाली है। विंशोत्तरी दशा 120 वर्षों को विभिन्न ग्रहों द्वारा शासित अवधियों में विभाजित करती है। प्रत्येक महादशा शासक ग्रह के आधार पर जीवन के विभिन्न पहलुओं को प्रभावित करती है।',
    
    // Sun Sign
    'sun.title': 'अपनी सूर्य राशि खोजें',
    'sun.desc': 'अपनी राशि जानने के लिए जन्म तिथि दर्ज करें',
    'sun.resultTitle': 'आपकी सूर्य राशि',
    'sun.element': 'तत्व',
    'sun.rulingPlanet': 'शासक ग्रह',
    'sun.keyTraits': 'प्रमुख विशेषताएं',
    'sun.readHoroscope': 'आज का राशिफल पढ़ें',
    'sun.whatIs': 'सूर्य राशि क्या है?',
    'sun.summary': 'आपकी सूर्य राशि आपके जन्म के समय सूर्य की स्थिति से निर्धारित होती है और यह आपके मूल व्यक्तित्व, अहंकार और जीवन उद्देश्य का प्रतिनिधित्व करती है। यह आपकी ज्योतिषीय पहचान का सबसे मौलिक पहलू है।',
    
    // Gemstone
    'gem.title': 'अपना रत्न खोजें',
    'gem.desc': 'अपनी जन्म कुंडली के अनुसार उपयुक्त रत्न खोजें',
    'gem.resultTitle': 'आपका अनुशंसित रत्न',
    'gem.planet': 'ग्रह',
    'gem.color': 'रंग',
    'gem.benefits': 'लाभ',
    'gem.browseStore': 'रत्न दुकान देखें',
    'gem.whatIs': 'ज्योतिषीय रत्न क्या हैं?',
    'gem.summary': 'ज्योतिषीय रत्न ग्रहों से जुड़े कीमती और अर्ध-कीमती पत्थर हैं। सही रत्न पहनने से आपकी जन्म कुंडली में लाभकारी ग्रह प्रभाव मजबूत हो सकते हैं और नकारात्मक प्रभाव कम हो सकते हैं।',
    
    // Consultation Page
    'consult.title': 'परामर्श बुक करें',
    'consult.subtitle': 'वीडियो कॉल के माध्यम से व्यक्तिगत ज्योतिष मार्गदर्शन प्राप्त करें। अपने घर के आराम से जुड़ें।',
    'consult.available': 'उपलब्ध',
    'consult.consultations': 'परामर्श',
    'consult.experience': 'वर्ष का अनुभव',
    'consult.schedule': 'परामर्श शेड्यूल करें',
    'consult.watchVideo': 'परिचय वीडियो देखें',
    'consult.hideVideo': 'वीडियो छुपाएं',
    'consult.howItWorks': 'यह कैसे काम करता है',
    'consult.step1': 'समय चुनें',
    'consult.step1Desc': 'कैलेंडर से सुविधाजनक स्लॉट चुनें',
    'consult.step2': 'विवरण भरें',
    'consult.step2Desc': 'सटीक पठन के लिए अपना जन्म विवरण दें',
    'consult.step3': 'बुकिंग की पुष्टि करें',
    'consult.step3Desc': 'बुकिंग प्रक्रिया पूरी करें',
    'consult.step4': 'वीडियो कॉल में शामिल हों',
    'consult.step4Desc': 'Google Meet लिंक प्राप्त करें और निर्धारित समय पर जुड़ें',
    'consult.questions': 'सवाल हैं? संपर्क करें',
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
