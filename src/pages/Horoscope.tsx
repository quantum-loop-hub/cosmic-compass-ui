import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, Briefcase, Coins, Activity } from 'lucide-react';
import HoroscopeNotificationSettings from '@/components/horoscope/HoroscopeNotificationSettings';

const zodiacSigns = [
  { name: 'Aries', nameHi: 'मेष', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  { name: 'Taurus', nameHi: 'वृषभ', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
  { name: 'Gemini', nameHi: 'मिथुन', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
  { name: 'Cancer', nameHi: 'कर्क', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
  { name: 'Leo', nameHi: 'सिंह', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  { name: 'Virgo', nameHi: 'कन्या', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  { name: 'Libra', nameHi: 'तुला', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
  { name: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
  { name: 'Sagittarius', nameHi: 'धनु', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
  { name: 'Capricorn', nameHi: 'मकर', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth' },
  { name: 'Aquarius', nameHi: 'कुंभ', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air' },
  { name: 'Pisces', nameHi: 'मीन', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water' },
];

const getHoroscopeData = (sign: string) => {
  const predictions: Record<string, any> = {
    aries: {
      overall: "Today brings exciting opportunities for personal growth. Your natural leadership qualities will shine, making it an excellent day for taking initiative in both personal and professional matters.",
      love: "Romance is in the air! Single Arians may encounter someone special. Those in relationships should express their feelings openly.",
      career: "A new project or opportunity may present itself. Trust your instincts and take the lead. Your confidence will inspire others.",
      finance: "Good day for financial planning. Avoid impulsive purchases and focus on long-term investments.",
      health: "High energy levels favor physical activities. Consider starting a new exercise routine.",
      luckyNumber: 9,
      luckyColor: "Red",
      compatibility: "Leo, Sagittarius"
    },
    taurus: {
      overall: "Stability and patience are your allies today. Focus on completing ongoing projects rather than starting new ones.",
      love: "Show appreciation to your partner through small gestures. Single Taureans should be open to unexpected connections.",
      career: "Steady progress at work. Your reliability will be recognized by superiors.",
      finance: "A good day for budgeting and saving. Consider secure investment options.",
      health: "Take time to relax and destress. A massage or spa day would be beneficial.",
      luckyNumber: 6,
      luckyColor: "Green",
      compatibility: "Virgo, Capricorn"
    },
    gemini: {
      overall: "Communication is your strength today. Express your ideas freely and engage in meaningful conversations.",
      love: "Intellectual connection deepens emotional bonds. Share your thoughts and listen actively.",
      career: "Networking opportunities abound. Attend social events or virtual meetups.",
      finance: "Avoid signing contracts without thorough review. Seek expert advice if needed.",
      health: "Mental stimulation is important. Try puzzles or learn something new.",
      luckyNumber: 5,
      luckyColor: "Yellow",
      compatibility: "Libra, Aquarius"
    },
    cancer: {
      overall: "Emotional sensitivity is heightened. Trust your intuition in making important decisions.",
      love: "Family matters take priority. Spend quality time with loved ones.",
      career: "Creative solutions will help overcome workplace challenges.",
      finance: "Focus on home-related investments. Real estate looks favorable.",
      health: "Emotional well-being affects physical health. Practice self-care.",
      luckyNumber: 2,
      luckyColor: "Silver",
      compatibility: "Scorpio, Pisces"
    },
    leo: {
      overall: "Your charisma is magnetic today. Use it to inspire and lead others positively.",
      love: "Romance flourishes with grand gestures. Plan something special for your partner.",
      career: "Leadership opportunities arise. Step up and showcase your abilities.",
      finance: "Generous spending is fine, but maintain a balance.",
      health: "Heart health is important. Include cardiovascular exercises.",
      luckyNumber: 1,
      luckyColor: "Gold",
      compatibility: "Aries, Sagittarius"
    },
    virgo: {
      overall: "Attention to detail brings success. Your analytical skills are in high demand.",
      love: "Practical expressions of love matter more than words today.",
      career: "Perfect day for organizing and planning. Create systems for efficiency.",
      finance: "Review financial statements and track expenses carefully.",
      health: "Digestive health needs attention. Eat mindfully.",
      luckyNumber: 5,
      luckyColor: "Navy Blue",
      compatibility: "Taurus, Capricorn"
    },
    libra: {
      overall: "Balance and harmony guide your day. Seek equilibrium in all aspects of life.",
      love: "Partnership is highlighted. Work on relationship harmony.",
      career: "Collaboration brings better results than solo efforts.",
      finance: "Fair deals and negotiations go in your favor.",
      health: "Social activities boost mental health. Connect with friends.",
      luckyNumber: 6,
      luckyColor: "Pink",
      compatibility: "Gemini, Aquarius"
    },
    scorpio: {
      overall: "Transformation and renewal are themes today. Let go of what no longer serves you.",
      love: "Deep emotional connections form. Vulnerability strengthens bonds.",
      career: "Research and investigation reveal hidden truths.",
      finance: "Shared finances need attention. Review joint accounts.",
      health: "Detox and cleansing routines are beneficial.",
      luckyNumber: 8,
      luckyColor: "Maroon",
      compatibility: "Cancer, Pisces"
    },
    sagittarius: {
      overall: "Adventure calls! Expand your horizons through travel or learning.",
      love: "Freedom within relationships creates stronger bonds.",
      career: "International or long-distance opportunities emerge.",
      finance: "Lucky streak in speculative ventures, but stay reasonable.",
      health: "Outdoor activities energize you. Go hiking or cycling.",
      luckyNumber: 3,
      luckyColor: "Purple",
      compatibility: "Aries, Leo"
    },
    capricorn: {
      overall: "Discipline and hard work lead to achievement. Set ambitious goals.",
      love: "Commitment and loyalty strengthen relationships.",
      career: "Recognition for past efforts comes. Promotions possible.",
      finance: "Long-term investments show promise. Stay patient.",
      health: "Bone and joint care is important. Include calcium-rich foods.",
      luckyNumber: 8,
      luckyColor: "Brown",
      compatibility: "Taurus, Virgo"
    },
    aquarius: {
      overall: "Innovation and originality set you apart. Think outside the box.",
      love: "Friendship-based romance thrives. Connect on intellectual level.",
      career: "Technology and humanitarian projects benefit from your input.",
      finance: "Unexpected gains possible from unconventional sources.",
      health: "Circulation needs attention. Stay hydrated and active.",
      luckyNumber: 4,
      luckyColor: "Electric Blue",
      compatibility: "Gemini, Libra"
    },
    pisces: {
      overall: "Intuition and creativity flow freely. Trust your inner guidance.",
      love: "Romantic and dreamy connections form. Express through art or music.",
      career: "Creative fields and healing professions are favored.",
      finance: "Be cautious with lending money. Trust instincts about investments.",
      health: "Rest and meditation are essential. Prioritize sleep.",
      luckyNumber: 7,
      luckyColor: "Sea Green",
      compatibility: "Cancer, Scorpio"
    }
  };
  return predictions[sign.toLowerCase()] || predictions.aries;
};

const Horoscope = () => {
  const { sign } = useParams<{ sign: string }>();
  const signData = zodiacSigns.find(s => s.name.toLowerCase() === sign?.toLowerCase());
  const horoscope = getHoroscopeData(sign || 'aries');

  if (!signData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 p-8 text-center">
            <p className="text-cosmic-silver mb-4">Zodiac sign not found</p>
            <Link to="/">
              <Button className="bg-gradient-gold text-cosmic-dark">Go Home</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Layout>
      <div className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-cosmic-silver hover:text-cosmic-gold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{signData.symbol}</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="text-gradient-gold">{signData.name} ({signData.nameHi})</span>
            </h1>
            <p className="text-cosmic-silver">{signData.dates} • {signData.element} Sign</p>
            <p className="text-cosmic-cyan mt-2">{today}</p>
          </div>

          {/* Overall Prediction */}
          <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 mb-6">
            <CardHeader>
              <CardTitle className="text-cosmic-gold flex items-center gap-2">
                <Star className="w-5 h-5" />
                Today's Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cosmic-silver leading-relaxed">{horoscope.overall}</p>
            </CardContent>
          </Card>

          {/* Detailed Sections */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-pink-400 flex items-center gap-2 text-lg">
                  <Heart className="w-4 h-4" />
                  Love & Relationships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cosmic-silver text-sm">{horoscope.love}</p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                  <Briefcase className="w-4 h-4" />
                  Career & Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cosmic-silver text-sm">{horoscope.career}</p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 flex items-center gap-2 text-lg">
                  <Coins className="w-4 h-4" />
                  Finance & Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cosmic-silver text-sm">{horoscope.finance}</p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400 flex items-center gap-2 text-lg">
                  <Activity className="w-4 h-4" />
                  Health & Wellness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cosmic-silver text-sm">{horoscope.health}</p>
              </CardContent>
            </Card>
          </div>

          {/* Lucky Info */}
          <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
            <CardContent className="py-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-cosmic-silver text-sm mb-1">Lucky Number</p>
                  <p className="text-2xl font-bold text-cosmic-gold">{horoscope.luckyNumber}</p>
                </div>
                <div>
                  <p className="text-cosmic-silver text-sm mb-1">Lucky Color</p>
                  <p className="text-lg font-semibold text-cosmic-cyan">{horoscope.luckyColor}</p>
                </div>
                <div>
                  <p className="text-cosmic-silver text-sm mb-1">Compatible With</p>
                  <p className="text-lg font-semibold text-cosmic-purple">{horoscope.compatibility}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horoscope Notification Settings */}
          <div className="mt-8">
            <HoroscopeNotificationSettings />
          </div>

          {/* Other Signs */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-cosmic-gold mb-4 text-center">Explore Other Signs</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {zodiacSigns.filter(s => s.name !== signData.name).map((s) => (
                <Link 
                  key={s.name} 
                  to={`/horoscope/${s.name.toLowerCase()}`}
                  className="bg-cosmic-dark/50 border border-cosmic-gold/20 hover:border-cosmic-gold/50 rounded-lg p-2 text-center transition-all"
                >
                  <div className="text-2xl">{s.symbol}</div>
                  <div className="text-cosmic-silver text-xs">{s.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Horoscope;
