import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, Gem, Calendar, Sparkles, Sun, Clock, Heart, Hand, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Numerology number meanings
const numerologyMeanings = {
  en: {
    1: { title: 'Number 1 - The Leader', meaning: 'Independence, ambition, new beginnings. Natural leaders with strong willpower.' },
    2: { title: 'Number 2 - The Diplomat', meaning: 'Cooperation, sensitivity, balance. Peacemakers who value harmony.' },
    3: { title: 'Number 3 - The Creative', meaning: 'Expression, creativity, joy. Artistic souls with great communication skills.' },
    4: { title: 'Number 4 - The Builder', meaning: 'Stability, hard work, practicality. Reliable and determined individuals.' },
    5: { title: 'Number 5 - The Freedom Seeker', meaning: 'Change, adventure, freedom. Dynamic personalities who embrace transformation.' },
    6: { title: 'Number 6 - The Nurturer', meaning: 'Love, responsibility, family. Caring souls devoted to home and community.' },
    7: { title: 'Number 7 - The Seeker', meaning: 'Wisdom, spirituality, analysis. Deep thinkers on a quest for truth.' },
    8: { title: 'Number 8 - The Achiever', meaning: 'Power, abundance, success. Material masters with strong business sense.' },
    9: { title: 'Number 9 - The Humanitarian', meaning: 'Compassion, completion, universal love. Old souls serving humanity.' },
  },
  hi: {
    1: { title: 'अंक 1 - नेता', meaning: 'स्वतंत्रता, महत्वाकांक्षा, नई शुरुआत। मजबूत इच्छाशक्ति वाले प्राकृतिक नेता।' },
    2: { title: 'अंक 2 - कूटनीतिज्ञ', meaning: 'सहयोग, संवेदनशीलता, संतुलन। सद्भाव को महत्व देने वाले शांतिदूत।' },
    3: { title: 'अंक 3 - रचनात्मक', meaning: 'अभिव्यक्ति, रचनात्मकता, आनंद। महान संचार कौशल वाली कलात्मक आत्माएं।' },
    4: { title: 'अंक 4 - निर्माता', meaning: 'स्थिरता, कड़ी मेहनत, व्यावहारिकता। विश्वसनीय और दृढ़ निश्चयी व्यक्ति।' },
    5: { title: 'अंक 5 - स्वतंत्रता प्रेमी', meaning: 'परिवर्तन, साहसिक कार्य, स्वतंत्रता। परिवर्तन को अपनाने वाले गतिशील व्यक्तित्व।' },
    6: { title: 'अंक 6 - पालनकर्ता', meaning: 'प्रेम, जिम्मेदारी, परिवार। घर और समुदाय के प्रति समर्पित देखभाल करने वाली आत्माएं।' },
    7: { title: 'अंक 7 - साधक', meaning: 'ज्ञान, आध्यात्मिकता, विश्लेषण। सत्य की खोज में गहरे विचारक।' },
    8: { title: 'अंक 8 - सफलता प्राप्तकर्ता', meaning: 'शक्ति, प्रचुरता, सफलता। मजबूत व्यापारिक समझ वाले भौतिक स्वामी।' },
    9: { title: 'अंक 9 - मानवतावादी', meaning: 'करुणा, पूर्णता, सार्वभौमिक प्रेम। मानवता की सेवा करने वाली पुरानी आत्माएं।' },
  }
};

const Calculators = () => {
  const { t, language } = useLanguage();
  
  // Numerology
  const [numerologyInput, setNumerologyInput] = useState({ name: '', birthDate: '' });
  const [numerologyResult, setNumerologyResult] = useState<any>(null);

  // Gemstone
  const [gemstoneInput, setGemstoneInput] = useState({ birthDate: '', birthTime: '' });
  const [gemstoneResult, setGemstoneResult] = useState<any>(null);

  // Panchang
  const [panchangLocation, setPanchangLocation] = useState('');
  const [panchangResult, setPanchangResult] = useState<any>(null);

  // Dasha
  const [dashaInput, setDashaInput] = useState({ birthDate: '', birthTime: '' });
  const [dashaResult, setDashaResult] = useState<any>(null);

  // Sun Sign
  const [sunSignDate, setSunSignDate] = useState('');
  const [sunSignResult, setSunSignResult] = useState<any>(null);

  const calculateNumerology = () => {
    if (!numerologyInput.name || !numerologyInput.birthDate) return;

    const lifePath = numerologyInput.birthDate.split('-').join('').split('').reduce((a, b) => a + parseInt(b), 0) % 9 || 9;
    
    // Calculate destiny number from name
    const nameValue = numerologyInput.name.toUpperCase().split('').reduce((acc, char) => {
      const val = char.charCodeAt(0) - 64;
      return acc + (val > 0 && val <= 26 ? val : 0);
    }, 0);
    const destinyNumber = nameValue % 9 || 9;
    
    setNumerologyResult({
      lifePath,
      destinyNumber,
      soulUrge: (lifePath + destinyNumber) % 9 || 9,
      personality: Math.abs(lifePath - destinyNumber) || 1,
      luckyNumbers: [lifePath, destinyNumber, (lifePath + destinyNumber) % 10],
      luckyColors: lifePath <= 3 ? ['Red', 'Orange', 'Yellow'] : lifePath <= 6 ? ['Green', 'Blue', 'Indigo'] : ['Violet', 'Gold', 'Silver'],
      luckyDays: lifePath % 2 === 0 ? ['Monday', 'Friday'] : ['Sunday', 'Thursday'],
      description: language === 'hi' 
        ? `जीवन पथ ${lifePath} ${lifePath <= 3 ? 'रचनात्मकता और आत्म-अभिव्यक्ति' : lifePath <= 6 ? 'जिम्मेदारी और पालन-पोषण' : 'ज्ञान और आध्यात्मिक अंतर्दृष्टि'} को इंगित करता है। आपका भाग्य अंक ${destinyNumber} ${destinyNumber <= 3 ? 'नेतृत्व क्षमता' : destinyNumber <= 6 ? 'सद्भाव-खोजी प्रकृति' : 'विश्लेषणात्मक क्षमताओं'} का सुझाव देता है।`
        : `Life Path ${lifePath} indicates ${lifePath <= 3 ? 'creativity and self-expression' : lifePath <= 6 ? 'responsibility and nurturing' : 'wisdom and spiritual insight'}. Your Destiny Number ${destinyNumber} suggests ${destinyNumber <= 3 ? 'leadership potential' : destinyNumber <= 6 ? 'harmony-seeking nature' : 'analytical abilities'}.`,
    });
  };

  const calculateGemstone = () => {
    if (!gemstoneInput.birthDate) return;

    const month = parseInt(gemstoneInput.birthDate.split('-')[1]);
    const gemstones: Record<number, any> = {
      1: { name: 'Garnet', nameHi: 'गार्नेट', planet: 'Mars', planetHi: 'मंगल', benefits: ['Protection', 'Energy', 'Passion'], benefitsHi: ['सुरक्षा', 'ऊर्जा', 'जुनून'], color: 'Deep Red', colorHi: 'गहरा लाल' },
      2: { name: 'Amethyst', nameHi: 'नीलम', planet: 'Saturn', planetHi: 'शनि', benefits: ['Peace', 'Wisdom', 'Protection'], benefitsHi: ['शांति', 'ज्ञान', 'सुरक्षा'], color: 'Purple', colorHi: 'बैंगनी' },
      3: { name: 'Aquamarine', nameHi: 'एक्वामरीन', planet: 'Jupiter', planetHi: 'बृहस्पति', benefits: ['Clarity', 'Courage', 'Communication'], benefitsHi: ['स्पष्टता', 'साहस', 'संवाद'], color: 'Light Blue', colorHi: 'हल्का नीला' },
      4: { name: 'Diamond', nameHi: 'हीरा', planet: 'Venus', planetHi: 'शुक्र', benefits: ['Love', 'Purity', 'Strength'], benefitsHi: ['प्रेम', 'पवित्रता', 'शक्ति'], color: 'Clear', colorHi: 'पारदर्शी' },
      5: { name: 'Emerald', nameHi: 'पन्ना', planet: 'Mercury', planetHi: 'बुध', benefits: ['Growth', 'Wisdom', 'Patience'], benefitsHi: ['विकास', 'ज्ञान', 'धैर्य'], color: 'Green', colorHi: 'हरा' },
      6: { name: 'Pearl', nameHi: 'मोती', planet: 'Moon', planetHi: 'चंद्रमा', benefits: ['Calm', 'Balance', 'Purity'], benefitsHi: ['शांति', 'संतुलन', 'पवित्रता'], color: 'White', colorHi: 'सफेद' },
      7: { name: 'Ruby', nameHi: 'माणिक्य', planet: 'Sun', planetHi: 'सूर्य', benefits: ['Passion', 'Protection', 'Prosperity'], benefitsHi: ['जुनून', 'सुरक्षा', 'समृद्धि'], color: 'Red', colorHi: 'लाल' },
      8: { name: 'Peridot', nameHi: 'पेरिडॉट', planet: 'Mercury', planetHi: 'बुध', benefits: ['Healing', 'Protection', 'Harmony'], benefitsHi: ['उपचार', 'सुरक्षा', 'सद्भाव'], color: 'Olive Green', colorHi: 'जैतून हरा' },
      9: { name: 'Blue Sapphire', nameHi: 'नीलम', planet: 'Saturn', planetHi: 'शनि', benefits: ['Wisdom', 'Focus', 'Discipline'], benefitsHi: ['ज्ञान', 'ध्यान', 'अनुशासन'], color: 'Blue', colorHi: 'नीला' },
      10: { name: 'Opal', nameHi: 'ओपल', planet: 'Venus', planetHi: 'शुक्र', benefits: ['Creativity', 'Confidence', 'Love'], benefitsHi: ['रचनात्मकता', 'आत्मविश्वास', 'प्रेम'], color: 'Iridescent', colorHi: 'इंद्रधनुषी' },
      11: { name: 'Topaz', nameHi: 'पुखराज', planet: 'Jupiter', planetHi: 'बृहस्पति', benefits: ['Joy', 'Abundance', 'Good Health'], benefitsHi: ['आनंद', 'प्रचुरता', 'अच्छा स्वास्थ्य'], color: 'Golden', colorHi: 'सुनहरा' },
      12: { name: 'Turquoise', nameHi: 'फ़िरोज़ा', planet: 'Jupiter', planetHi: 'बृहस्पति', benefits: ['Protection', 'Luck', 'Success'], benefitsHi: ['सुरक्षा', 'भाग्य', 'सफलता'], color: 'Blue-Green', colorHi: 'नीला-हरा' },
    };

    setGemstoneResult(gemstones[month] || gemstones[1]);
  };

  const calculatePanchang = () => {
    if (!panchangLocation) return;

    const today = new Date();
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    const tithisHi = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'];
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const nakshatrasHi = ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्व फाल्गुनी', 'उत्तर फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्व भाद्रपद', 'उत्तर भाद्रपद', 'रेवती'];
    const yogas = ['Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
    const yogasHi = ['विष्कुंभ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगंड', 'सुकर्मा', 'धृति', 'शूल', 'गंड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतिपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इंद्र', 'वैधृति'];
    const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
    const karanasHi = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'];

    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const tithiIndex = dayOfYear % 15;
    const nakshatraIndex = dayOfYear % 27;
    const yogaIndex = dayOfYear % 27;
    const karanaIndex = dayOfYear % 11;
    
    setPanchangResult({
      date: today.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      location: panchangLocation,
      tithi: language === 'hi' ? tithisHi[tithiIndex] : tithis[tithiIndex],
      nakshatra: language === 'hi' ? nakshatrasHi[nakshatraIndex] : nakshatras[nakshatraIndex],
      yoga: language === 'hi' ? yogasHi[yogaIndex] : yogas[yogaIndex],
      karana: language === 'hi' ? karanasHi[karanaIndex] : karanas[karanaIndex],
      sunrise: '06:45 AM',
      sunset: '06:15 PM',
      moonrise: '08:30 PM',
      rahuKaal: '07:30 AM - 09:00 AM',
      gulikaKaal: '03:00 PM - 04:30 PM',
      auspicious: dayOfYear % 3 !== 0,
    });
  };

  const calculateDasha = () => {
    if (!dashaInput.birthDate) return;

    const planets = language === 'hi' ? [
      { name: 'सूर्य (Sun)', duration: 6, effects: 'नेतृत्व, प्रसिद्धि, अधिकार, सरकारी अनुग्रह' },
      { name: 'चंद्र (Moon)', duration: 10, effects: 'भावनात्मक विकास, यात्रा, सार्वजनिक व्यवहार' },
      { name: 'मंगल (Mars)', duration: 7, effects: 'ऊर्जा, संपत्ति, भाई-बहन, साहस' },
      { name: 'राहु (Rahu)', duration: 18, effects: 'विदेश संबंध, अचानक परिवर्तन, भौतिक लाभ' },
      { name: 'बृहस्पति (Jupiter)', duration: 16, effects: 'ज्ञान, संतान, आध्यात्मिकता, धन' },
      { name: 'शनि (Saturn)', duration: 19, effects: 'अनुशासन, कर्म, कठिन परिश्रम, देरी' },
      { name: 'बुध (Mercury)', duration: 17, effects: 'संवाद, व्यापार, बुद्धि' },
      { name: 'केतु (Ketu)', duration: 7, effects: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म' },
      { name: 'शुक्र (Venus)', duration: 20, effects: 'प्रेम, विलासिता, कला, संबंध' },
    ] : [
      { name: 'Sun (Surya)', duration: 6, effects: 'Leadership, fame, authority, government favor' },
      { name: 'Moon (Chandra)', duration: 10, effects: 'Emotional growth, travel, public dealings' },
      { name: 'Mars (Mangal)', duration: 7, effects: 'Energy, property, siblings, courage' },
      { name: 'Rahu', duration: 18, effects: 'Foreign connections, sudden changes, material gains' },
      { name: 'Jupiter (Guru)', duration: 16, effects: 'Wisdom, children, spirituality, wealth' },
      { name: 'Saturn (Shani)', duration: 19, effects: 'Discipline, karma, hard work, delays' },
      { name: 'Mercury (Budh)', duration: 17, effects: 'Communication, business, intelligence' },
      { name: 'Ketu', duration: 7, effects: 'Spirituality, detachment, past karma' },
      { name: 'Venus (Shukra)', duration: 20, effects: 'Love, luxury, arts, relationships' },
    ];

    const birthYear = parseInt(dashaInput.birthDate.split('-')[0]);
    const currentYear = new Date().getFullYear();
    const yearsLived = currentYear - birthYear;
    
    let accumulatedYears = 0;
    let currentDashaIndex = 0;
    
    for (let i = 0; i < planets.length * 3; i++) {
      accumulatedYears += planets[i % planets.length].duration;
      if (accumulatedYears > yearsLived) {
        currentDashaIndex = i % planets.length;
        break;
      }
    }

    const currentDasha = planets[currentDashaIndex];
    const nextDasha = planets[(currentDashaIndex + 1) % planets.length];

    setDashaResult({
      current: currentDasha,
      next: nextDasha,
      allDashas: planets,
      yearsRemaining: accumulatedYears - yearsLived,
    });
  };

  const calculateSunSign = () => {
    if (!sunSignDate) return;

    const date = new Date(sunSignDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const signs = [
      { name: 'Capricorn', nameHi: 'मकर', symbol: '♑', dates: 'Dec 22 - Jan 19', datesHi: '22 दिसंबर - 19 जनवरी', element: 'Earth', elementHi: 'पृथ्वी', ruling: 'Saturn', rulingHi: 'शनि', traits: ['Ambitious', 'Disciplined', 'Patient', 'Practical'], traitsHi: ['महत्वाकांक्षी', 'अनुशासित', 'धैर्यवान', 'व्यावहारिक'] },
      { name: 'Aquarius', nameHi: 'कुंभ', symbol: '♒', dates: 'Jan 20 - Feb 18', datesHi: '20 जनवरी - 18 फरवरी', element: 'Air', elementHi: 'वायु', ruling: 'Uranus', rulingHi: 'यूरेनस', traits: ['Innovative', 'Independent', 'Humanitarian', 'Intellectual'], traitsHi: ['नवोन्मेषी', 'स्वतंत्र', 'मानवतावादी', 'बौद्धिक'] },
      { name: 'Pisces', nameHi: 'मीन', symbol: '♓', dates: 'Feb 19 - Mar 20', datesHi: '19 फरवरी - 20 मार्च', element: 'Water', elementHi: 'जल', ruling: 'Neptune', rulingHi: 'नेप्च्यून', traits: ['Compassionate', 'Intuitive', 'Artistic', 'Gentle'], traitsHi: ['दयालु', 'सहज ज्ञान', 'कलात्मक', 'सौम्य'] },
      { name: 'Aries', nameHi: 'मेष', symbol: '♈', dates: 'Mar 21 - Apr 19', datesHi: '21 मार्च - 19 अप्रैल', element: 'Fire', elementHi: 'अग्नि', ruling: 'Mars', rulingHi: 'मंगल', traits: ['Courageous', 'Energetic', 'Optimistic', 'Passionate'], traitsHi: ['साहसी', 'ऊर्जावान', 'आशावादी', 'जोशीला'] },
      { name: 'Taurus', nameHi: 'वृषभ', symbol: '♉', dates: 'Apr 20 - May 20', datesHi: '20 अप्रैल - 20 मई', element: 'Earth', elementHi: 'पृथ्वी', ruling: 'Venus', rulingHi: 'शुक्र', traits: ['Reliable', 'Patient', 'Practical', 'Devoted'], traitsHi: ['विश्वसनीय', 'धैर्यवान', 'व्यावहारिक', 'समर्पित'] },
      { name: 'Gemini', nameHi: 'मिथुन', symbol: '♊', dates: 'May 21 - Jun 20', datesHi: '21 मई - 20 जून', element: 'Air', elementHi: 'वायु', ruling: 'Mercury', rulingHi: 'बुध', traits: ['Adaptable', 'Curious', 'Communicative', 'Witty'], traitsHi: ['अनुकूलनीय', 'जिज्ञासु', 'संवादी', 'हाजिरजवाब'] },
      { name: 'Cancer', nameHi: 'कर्क', symbol: '♋', dates: 'Jun 21 - Jul 22', datesHi: '21 जून - 22 जुलाई', element: 'Water', elementHi: 'जल', ruling: 'Moon', rulingHi: 'चंद्रमा', traits: ['Nurturing', 'Protective', 'Intuitive', 'Emotional'], traitsHi: ['पालनकर्ता', 'रक्षात्मक', 'सहज ज्ञानी', 'भावनात्मक'] },
      { name: 'Leo', nameHi: 'सिंह', symbol: '♌', dates: 'Jul 23 - Aug 22', datesHi: '23 जुलाई - 22 अगस्त', element: 'Fire', elementHi: 'अग्नि', ruling: 'Sun', rulingHi: 'सूर्य', traits: ['Creative', 'Generous', 'Warm-hearted', 'Cheerful'], traitsHi: ['रचनात्मक', 'उदार', 'दयालु', 'प्रसन्न'] },
      { name: 'Virgo', nameHi: 'कन्या', symbol: '♍', dates: 'Aug 23 - Sep 22', datesHi: '23 अगस्त - 22 सितंबर', element: 'Earth', elementHi: 'पृथ्वी', ruling: 'Mercury', rulingHi: 'बुध', traits: ['Analytical', 'Helpful', 'Reliable', 'Precise'], traitsHi: ['विश्लेषणात्मक', 'सहायक', 'विश्वसनीय', 'सटीक'] },
      { name: 'Libra', nameHi: 'तुला', symbol: '♎', dates: 'Sep 23 - Oct 22', datesHi: '23 सितंबर - 22 अक्टूबर', element: 'Air', elementHi: 'वायु', ruling: 'Venus', rulingHi: 'शुक्र', traits: ['Diplomatic', 'Fair', 'Social', 'Idealistic'], traitsHi: ['कूटनीतिक', 'न्यायप्रिय', 'सामाजिक', 'आदर्शवादी'] },
      { name: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 - Nov 21', datesHi: '23 अक्टूबर - 21 नवंबर', element: 'Water', elementHi: 'जल', ruling: 'Pluto', rulingHi: 'प्लूटो', traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn'], traitsHi: ['संसाधनशील', 'बहादुर', 'जोशीला', 'जिद्दी'] },
      { name: 'Sagittarius', nameHi: 'धनु', symbol: '♐', dates: 'Nov 22 - Dec 21', datesHi: '22 नवंबर - 21 दिसंबर', element: 'Fire', elementHi: 'अग्नि', ruling: 'Jupiter', rulingHi: 'बृहस्पति', traits: ['Generous', 'Idealistic', 'Great sense of humor', 'Adventurous'], traitsHi: ['उदार', 'आदर्शवादी', 'हास्य बोध', 'साहसी'] },
    ];

    const signRanges = [
      [1, 19], [2, 18], [3, 20], [4, 19], [5, 20], [6, 20],
      [7, 22], [8, 22], [9, 22], [10, 22], [11, 21], [12, 21]
    ];

    let signIndex = 0;
    for (let i = 0; i < 12; i++) {
      const [m, d] = signRanges[i];
      if (month === m && day <= d) {
        signIndex = i;
        break;
      } else if (month === m) {
        signIndex = (i + 1) % 12;
        break;
      }
    }

    if (month === 12 && day >= 22) signIndex = 0;
    else if (month === 1 && day <= 19) signIndex = 0;
    else if (month === 1 && day >= 20) signIndex = 1;
    else if (month === 2 && day <= 18) signIndex = 1;
    else if (month === 2 && day >= 19) signIndex = 2;
    else if (month === 3 && day <= 20) signIndex = 2;
    else if (month === 3 && day >= 21) signIndex = 3;
    else if (month === 4 && day <= 19) signIndex = 3;
    else if (month === 4 && day >= 20) signIndex = 4;
    else if (month === 5 && day <= 20) signIndex = 4;
    else if (month === 5 && day >= 21) signIndex = 5;
    else if (month === 6 && day <= 20) signIndex = 5;
    else if (month === 6 && day >= 21) signIndex = 6;
    else if (month === 7 && day <= 22) signIndex = 6;
    else if (month === 7 && day >= 23) signIndex = 7;
    else if (month === 8 && day <= 22) signIndex = 7;
    else if (month === 8 && day >= 23) signIndex = 8;
    else if (month === 9 && day <= 22) signIndex = 8;
    else if (month === 9 && day >= 23) signIndex = 9;
    else if (month === 10 && day <= 22) signIndex = 9;
    else if (month === 10 && day >= 23) signIndex = 10;
    else if (month === 11 && day <= 21) signIndex = 10;
    else if (month === 11 && day >= 22) signIndex = 11;
    else if (month === 12 && day <= 21) signIndex = 11;

    setSunSignResult(signs[signIndex]);
  };

  const meanings = numerologyMeanings[language];

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">{t('calc.title')}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('calc.subtitle')}
            </p>
          </div>

          {/* Quick Links to Other Tools */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link to="/kundli-matching">
              <Card className="bg-card/50 border-primary/30 hover:border-primary/60 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-pink-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-primary font-semibold">{t('calc.kundliMatching')}</h3>
                    <p className="text-muted-foreground text-sm">{t('calc.gunMilan')}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/palm-reading">
              <Card className="bg-card/50 border-primary/30 hover:border-primary/60 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <Hand className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-primary font-semibold">{t('calc.palmReading')}</h3>
                    <p className="text-muted-foreground text-sm">{t('calc.aiPalmistry')}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Tabs defaultValue="numerology" className="space-y-8">
            <TabsList className="grid grid-cols-5 bg-card/50 border border-primary/30 h-auto p-1">
              <TabsTrigger value="numerology" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2">
                <Hash className="w-4 h-4 mr-1 hidden sm:inline" />
                {t('calc.numerology')}
              </TabsTrigger>
              <TabsTrigger value="panchang" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2">
                <Calendar className="w-4 h-4 mr-1 hidden sm:inline" />
                {t('calc.panchang')}
              </TabsTrigger>
              <TabsTrigger value="dasha" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2">
                <Clock className="w-4 h-4 mr-1 hidden sm:inline" />
                {t('calc.dasha')}
              </TabsTrigger>
              <TabsTrigger value="sunsign" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2">
                <Sun className="w-4 h-4 mr-1 hidden sm:inline" />
                {t('calc.sunSign')}
              </TabsTrigger>
              <TabsTrigger value="gemstone" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2">
                <Gem className="w-4 h-4 mr-1 hidden sm:inline" />
                {t('calc.gemstone')}
              </TabsTrigger>
            </TabsList>

            {/* Numerology Calculator */}
            <TabsContent value="numerology">
              {/* Summary Section */}
              <Card className="bg-accent/10 border-accent/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{t('num.whatIs')}</h3>
                      <p className="text-muted-foreground text-sm">{t('num.summary')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Number Meanings */}
              <Card className="bg-card/30 border-primary/20 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary text-lg">{language === 'hi' ? 'अंकों का अर्थ' : 'Number Meanings'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(meanings).map(([num, data]) => (
                      <div key={num} className="bg-background/50 rounded-lg p-3 border border-primary/10">
                        <div className="text-primary font-semibold text-sm">{data.title}</div>
                        <p className="text-muted-foreground text-xs mt-1">{data.meaning}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('num.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('num.desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('num.fullName')}</Label>
                      <Input
                        value={numerologyInput.name}
                        onChange={(e) => setNumerologyInput({ ...numerologyInput, name: e.target.value })}
                        className="bg-background border-primary/30"
                        placeholder={language === 'hi' ? 'जन्म प्रमाण पत्र के अनुसार' : 'As per birth certificate'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('num.birthDate')}</Label>
                      <Input
                        type="date"
                        value={numerologyInput.birthDate}
                        onChange={(e) => setNumerologyInput({ ...numerologyInput, birthDate: e.target.value })}
                        className="bg-background border-primary/30"
                      />
                    </div>
                    <Button
                      onClick={calculateNumerology}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {t('calc.calculate')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('num.resultTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {numerologyResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-background/50 rounded-lg p-3 text-center">
                            <div className="text-muted-foreground text-sm">{t('num.lifePath')}</div>
                            <div className="text-3xl font-bold text-primary">{numerologyResult.lifePath}</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3 text-center">
                            <div className="text-muted-foreground text-sm">{t('num.destiny')}</div>
                            <div className="text-3xl font-bold text-primary">{numerologyResult.destinyNumber}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm mb-1">{t('num.luckyNumbers')}</div>
                          <div className="flex gap-2">
                            {numerologyResult.luckyNumbers.map((n: number, i: number) => (
                              <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm mb-1">{t('num.luckyColors')}</div>
                          <div className="flex gap-2 flex-wrap">
                            {numerologyResult.luckyColors.map((c: string) => (
                              <span key={c} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{numerologyResult.description}</p>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground/50">
                        {t('calc.enterDetails')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Panchang Calculator */}
            <TabsContent value="panchang">
              {/* Summary Section */}
              <Card className="bg-accent/10 border-accent/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{t('pnc.whatIs')}</h3>
                      <p className="text-muted-foreground text-sm">{t('pnc.summary')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('pnc.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('pnc.desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('pnc.location')}</Label>
                      <Input
                        value={panchangLocation}
                        onChange={(e) => setPanchangLocation(e.target.value)}
                        className="bg-background border-primary/30"
                        placeholder={language === 'hi' ? 'शहर, देश (जैसे, दिल्ली, भारत)' : 'City, Country (e.g., Delhi, India)'}
                      />
                    </div>
                    <Button
                      onClick={calculatePanchang}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {t('calc.getPanchang')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('pnc.resultTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {panchangResult ? (
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b border-primary/20">
                          <p className="text-accent">{panchangResult.date}</p>
                          <p className="text-muted-foreground text-sm">{panchangResult.location}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-muted-foreground text-xs">{t('pnc.tithi')}</div>
                            <div className="text-primary font-semibold">{panchangResult.tithi}</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-muted-foreground text-xs">{t('pnc.nakshatra')}</div>
                            <div className="text-primary font-semibold">{panchangResult.nakshatra}</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-muted-foreground text-xs">{t('pnc.yoga')}</div>
                            <div className="text-primary font-semibold">{panchangResult.yoga}</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-muted-foreground text-xs">{t('pnc.karana')}</div>
                            <div className="text-primary font-semibold">{panchangResult.karana}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('pnc.sunrise')}: </span>
                            <span className="text-primary">{panchangResult.sunrise}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('pnc.sunset')}: </span>
                            <span className="text-primary">{panchangResult.sunset}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('pnc.rahuKaal')}: </span>
                            <span className="text-red-400">{panchangResult.rahuKaal}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('pnc.gulikaKaal')}: </span>
                            <span className="text-yellow-400">{panchangResult.gulikaKaal}</span>
                          </div>
                        </div>
                        <div className={`text-center p-2 rounded-lg ${panchangResult.auspicious ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {panchangResult.auspicious ? `✓ ${t('pnc.auspicious')}` : `! ${t('pnc.notAuspicious')}`}
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground/50">
                        {t('calc.enterDetails')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Dasha Calculator */}
            <TabsContent value="dasha">
              {/* Summary Section */}
              <Card className="bg-accent/10 border-accent/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{t('dsh.whatIs')}</h3>
                      <p className="text-muted-foreground text-sm">{t('dsh.summary')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('dsh.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('dsh.desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('num.birthDate')}</Label>
                      <Input
                        type="date"
                        value={dashaInput.birthDate}
                        onChange={(e) => setDashaInput({ ...dashaInput, birthDate: e.target.value })}
                        className="bg-background border-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('dsh.birthTime')}</Label>
                      <Input
                        type="time"
                        value={dashaInput.birthTime}
                        onChange={(e) => setDashaInput({ ...dashaInput, birthTime: e.target.value })}
                        className="bg-background border-primary/30"
                      />
                    </div>
                    <Button
                      onClick={calculateDasha}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {t('calc.calculateDasha')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('dsh.resultTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashaResult ? (
                      <div className="space-y-4">
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                          <div className="text-muted-foreground text-sm">{t('dsh.currentMahadasha')}</div>
                          <div className="text-xl font-bold text-primary">{dashaResult.current.name}</div>
                          <div className="text-accent text-sm">~{dashaResult.yearsRemaining} {t('dsh.yearsRemaining')}</div>
                          <p className="text-muted-foreground text-sm mt-2">{dashaResult.current.effects}</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4">
                          <div className="text-muted-foreground text-sm">{t('dsh.nextMahadasha')}</div>
                          <div className="text-lg font-semibold text-accent">{dashaResult.next.name}</div>
                          <div className="text-muted-foreground text-xs">{dashaResult.next.duration} {t('dsh.yearsPeriod')}</div>
                          <p className="text-muted-foreground text-sm mt-2">{dashaResult.next.effects}</p>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          <p className="font-semibold mb-2">{t('dsh.sequence')}</p>
                          <div className="flex flex-wrap gap-1">
                            {dashaResult.allDashas.map((d: any, i: number) => (
                              <span key={i} className={`px-2 py-0.5 rounded ${d.name === dashaResult.current.name ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                {d.name.split(' ')[0]} ({d.duration}y)
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground/50">
                        {t('calc.enterDetails')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sun Sign Calculator */}
            <TabsContent value="sunsign">
              {/* Summary Section */}
              <Card className="bg-accent/10 border-accent/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{t('sun.whatIs')}</h3>
                      <p className="text-muted-foreground text-sm">{t('sun.summary')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('sun.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('sun.desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('num.birthDate')}</Label>
                      <Input
                        type="date"
                        value={sunSignDate}
                        onChange={(e) => setSunSignDate(e.target.value)}
                        className="bg-background border-primary/30"
                      />
                    </div>
                    <Button
                      onClick={calculateSunSign}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {t('calc.findMySign')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('sun.resultTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sunSignResult ? (
                      <div className="text-center space-y-4">
                        <div className="text-6xl">{sunSignResult.symbol}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-primary">{language === 'hi' ? sunSignResult.nameHi : sunSignResult.name}</h3>
                          <p className="text-accent">{language === 'hi' ? sunSignResult.name : sunSignResult.nameHi}</p>
                        </div>
                        <p className="text-muted-foreground text-sm">{language === 'hi' ? sunSignResult.datesHi : sunSignResult.dates}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-background/50 rounded-lg p-2">
                            <div className="text-muted-foreground text-xs">{t('sun.element')}</div>
                            <div className="text-accent">{language === 'hi' ? sunSignResult.elementHi : sunSignResult.element}</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-2">
                            <div className="text-muted-foreground text-xs">{t('sun.rulingPlanet')}</div>
                            <div className="text-accent">{language === 'hi' ? sunSignResult.rulingHi : sunSignResult.ruling}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm mb-2">{t('sun.keyTraits')}</div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {(language === 'hi' ? sunSignResult.traitsHi : sunSignResult.traits).map((tr: string) => (
                              <span key={tr} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                                {tr}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link to={`/horoscope/${sunSignResult.name.toLowerCase()}`}>
                          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 mt-4">
                            {t('sun.readHoroscope')}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground/50">
                        {t('calc.enterDetails')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gemstone Calculator */}
            <TabsContent value="gemstone">
              {/* Summary Section */}
              <Card className="bg-accent/10 border-accent/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{t('gem.whatIs')}</h3>
                      <p className="text-muted-foreground text-sm">{t('gem.summary')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('gem.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('gem.desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('num.birthDate')}</Label>
                      <Input
                        type="date"
                        value={gemstoneInput.birthDate}
                        onChange={(e) => setGemstoneInput({ ...gemstoneInput, birthDate: e.target.value })}
                        className="bg-background border-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t('dsh.birthTime')}</Label>
                      <Input
                        type="time"
                        value={gemstoneInput.birthTime}
                        onChange={(e) => setGemstoneInput({ ...gemstoneInput, birthTime: e.target.value })}
                        className="bg-background border-primary/30"
                      />
                    </div>
                    <Button
                      onClick={calculateGemstone}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {t('calc.findGemstone')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('gem.resultTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {gemstoneResult ? (
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <Gem className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary">{language === 'hi' ? gemstoneResult.nameHi : gemstoneResult.name}</h3>
                        <p className="text-accent">{t('gem.planet')}: {language === 'hi' ? gemstoneResult.planetHi : gemstoneResult.planet}</p>
                        <p className="text-muted-foreground">{t('gem.color')}: {language === 'hi' ? gemstoneResult.colorHi : gemstoneResult.color}</p>
                        <div>
                          <div className="text-muted-foreground text-sm mb-2">{t('gem.benefits')}</div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {(language === 'hi' ? gemstoneResult.benefitsHi : gemstoneResult.benefits).map((b: string) => (
                              <span key={b} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link to="/gemstone-store">
                          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 mt-4">
                            {t('gem.browseStore')}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground/50">
                        {t('calc.enterDetails')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Calculators;