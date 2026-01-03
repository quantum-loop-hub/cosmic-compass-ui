import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, Gem, Calendar, Sparkles, Sun, Clock, Heart, Hand } from 'lucide-react';

const Calculators = () => {
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
      description: `Life Path ${lifePath} indicates ${lifePath <= 3 ? 'creativity and self-expression' : lifePath <= 6 ? 'responsibility and nurturing' : 'wisdom and spiritual insight'}. Your Destiny Number ${destinyNumber} suggests ${destinyNumber <= 3 ? 'leadership potential' : destinyNumber <= 6 ? 'harmony-seeking nature' : 'analytical abilities'}.`,
    });
  };

  const calculateGemstone = () => {
    if (!gemstoneInput.birthDate) return;

    const month = parseInt(gemstoneInput.birthDate.split('-')[1]);
    const gemstones: Record<number, any> = {
      1: { name: 'Garnet', planet: 'Mars', benefits: ['Protection', 'Energy', 'Passion'], color: 'Deep Red' },
      2: { name: 'Amethyst', planet: 'Saturn', benefits: ['Peace', 'Wisdom', 'Protection'], color: 'Purple' },
      3: { name: 'Aquamarine', planet: 'Jupiter', benefits: ['Clarity', 'Courage', 'Communication'], color: 'Light Blue' },
      4: { name: 'Diamond', planet: 'Venus', benefits: ['Love', 'Purity', 'Strength'], color: 'Clear' },
      5: { name: 'Emerald', planet: 'Mercury', benefits: ['Growth', 'Wisdom', 'Patience'], color: 'Green' },
      6: { name: 'Pearl', planet: 'Moon', benefits: ['Calm', 'Balance', 'Purity'], color: 'White' },
      7: { name: 'Ruby', planet: 'Sun', benefits: ['Passion', 'Protection', 'Prosperity'], color: 'Red' },
      8: { name: 'Peridot', planet: 'Mercury', benefits: ['Healing', 'Protection', 'Harmony'], color: 'Olive Green' },
      9: { name: 'Blue Sapphire', planet: 'Saturn', benefits: ['Wisdom', 'Focus', 'Discipline'], color: 'Blue' },
      10: { name: 'Opal', planet: 'Venus', benefits: ['Creativity', 'Confidence', 'Love'], color: 'Iridescent' },
      11: { name: 'Topaz', planet: 'Jupiter', benefits: ['Joy', 'Abundance', 'Good Health'], color: 'Golden' },
      12: { name: 'Turquoise', planet: 'Jupiter', benefits: ['Protection', 'Luck', 'Success'], color: 'Blue-Green' },
    };

    setGemstoneResult(gemstones[month] || gemstones[1]);
  };

  const calculatePanchang = () => {
    if (!panchangLocation) return;

    const today = new Date();
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const yogas = ['Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
    const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];

    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    setPanchangResult({
      date: today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      location: panchangLocation,
      tithi: tithis[dayOfYear % 15],
      nakshatra: nakshatras[dayOfYear % 27],
      yoga: yogas[dayOfYear % 27],
      karana: karanas[dayOfYear % 11],
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

    const planets = [
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
      { name: 'Capricorn', nameHi: 'मकर', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth', ruling: 'Saturn', traits: ['Ambitious', 'Disciplined', 'Patient', 'Practical'] },
      { name: 'Aquarius', nameHi: 'कुंभ', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air', ruling: 'Uranus', traits: ['Innovative', 'Independent', 'Humanitarian', 'Intellectual'] },
      { name: 'Pisces', nameHi: 'मीन', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water', ruling: 'Neptune', traits: ['Compassionate', 'Intuitive', 'Artistic', 'Gentle'] },
      { name: 'Aries', nameHi: 'मेष', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire', ruling: 'Mars', traits: ['Courageous', 'Energetic', 'Optimistic', 'Passionate'] },
      { name: 'Taurus', nameHi: 'वृषभ', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth', ruling: 'Venus', traits: ['Reliable', 'Patient', 'Practical', 'Devoted'] },
      { name: 'Gemini', nameHi: 'मिथुन', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air', ruling: 'Mercury', traits: ['Adaptable', 'Curious', 'Communicative', 'Witty'] },
      { name: 'Cancer', nameHi: 'कर्क', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water', ruling: 'Moon', traits: ['Nurturing', 'Protective', 'Intuitive', 'Emotional'] },
      { name: 'Leo', nameHi: 'सिंह', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire', ruling: 'Sun', traits: ['Creative', 'Generous', 'Warm-hearted', 'Cheerful'] },
      { name: 'Virgo', nameHi: 'कन्या', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth', ruling: 'Mercury', traits: ['Analytical', 'Helpful', 'Reliable', 'Precise'] },
      { name: 'Libra', nameHi: 'तुला', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air', ruling: 'Venus', traits: ['Diplomatic', 'Fair', 'Social', 'Idealistic'] },
      { name: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water', ruling: 'Pluto', traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn'] },
      { name: 'Sagittarius', nameHi: 'धनु', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire', ruling: 'Jupiter', traits: ['Generous', 'Idealistic', 'Great sense of humor', 'Adventurous'] },
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

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-16 h-16 text-cosmic-gold animate-glow-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Astrology Calculators</span>
            </h1>
            <p className="text-cosmic-silver max-w-2xl mx-auto">
              Discover your lucky numbers, gemstones, planetary periods, and more with our free calculators.
            </p>
          </div>

          {/* Quick Links to Other Tools */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link to="/kundli-matching">
              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 hover:border-cosmic-gold/60 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-pink-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-cosmic-gold font-semibold">Kundli Matching</h3>
                    <p className="text-cosmic-silver text-sm">Gun Milan compatibility</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/palm-reading">
              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30 hover:border-cosmic-gold/60 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <Hand className="w-8 h-8 text-cosmic-cyan group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-cosmic-gold font-semibold">Palm Reading</h3>
                    <p className="text-cosmic-silver text-sm">AI palmistry analysis</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Tabs defaultValue="numerology" className="space-y-8">
            <TabsList className="grid grid-cols-5 bg-cosmic-dark/50 border border-cosmic-gold/30 h-auto p-1">
              <TabsTrigger value="numerology" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark text-xs sm:text-sm py-2">
                <Hash className="w-4 h-4 mr-1 hidden sm:inline" />
                Numerology
              </TabsTrigger>
              <TabsTrigger value="panchang" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark text-xs sm:text-sm py-2">
                <Calendar className="w-4 h-4 mr-1 hidden sm:inline" />
                Panchang
              </TabsTrigger>
              <TabsTrigger value="dasha" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark text-xs sm:text-sm py-2">
                <Clock className="w-4 h-4 mr-1 hidden sm:inline" />
                Dasha
              </TabsTrigger>
              <TabsTrigger value="sunsign" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark text-xs sm:text-sm py-2">
                <Sun className="w-4 h-4 mr-1 hidden sm:inline" />
                Sun Sign
              </TabsTrigger>
              <TabsTrigger value="gemstone" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark text-xs sm:text-sm py-2">
                <Gem className="w-4 h-4 mr-1 hidden sm:inline" />
                Gemstone
              </TabsTrigger>
            </TabsList>

            {/* Numerology Calculator */}
            <TabsContent value="numerology">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Calculate Your Numbers</CardTitle>
                    <CardDescription className="text-cosmic-silver">
                      Enter your details to find your numerology profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Full Name</Label>
                      <Input
                        value={numerologyInput.name}
                        onChange={(e) => setNumerologyInput({ ...numerologyInput, name: e.target.value })}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                        placeholder="As per birth certificate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Birth Date</Label>
                      <Input
                        type="date"
                        value={numerologyInput.birthDate}
                        onChange={(e) => setNumerologyInput({ ...numerologyInput, birthDate: e.target.value })}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      />
                    </div>
                    <Button
                      onClick={calculateNumerology}
                      className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                    >
                      Calculate
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Your Numerology Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {numerologyResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-cosmic-darker/50 rounded-lg p-3 text-center">
                            <div className="text-cosmic-silver text-sm">Life Path</div>
                            <div className="text-3xl font-bold text-cosmic-gold">{numerologyResult.lifePath}</div>
                          </div>
                          <div className="bg-cosmic-darker/50 rounded-lg p-3 text-center">
                            <div className="text-cosmic-silver text-sm">Destiny</div>
                            <div className="text-3xl font-bold text-cosmic-gold">{numerologyResult.destinyNumber}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-cosmic-silver text-sm mb-1">Lucky Numbers</div>
                          <div className="flex gap-2">
                            {numerologyResult.luckyNumbers.map((n: number, i: number) => (
                              <span key={i} className="bg-cosmic-gold/20 text-cosmic-gold px-3 py-1 rounded-full text-sm">
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-cosmic-silver text-sm mb-1">Lucky Colors</div>
                          <div className="flex gap-2 flex-wrap">
                            {numerologyResult.luckyColors.map((c: string) => (
                              <span key={c} className="bg-cosmic-purple/20 text-cosmic-purple px-3 py-1 rounded-full text-sm">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-cosmic-silver text-sm">{numerologyResult.description}</p>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-cosmic-silver/50">
                        Enter your details to see results
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Panchang Calculator */}
            <TabsContent value="panchang">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Today's Panchang</CardTitle>
                    <CardDescription className="text-cosmic-silver">
                      Get detailed Panchang for your location
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Your Location</Label>
                      <Input
                        value={panchangLocation}
                        onChange={(e) => setPanchangLocation(e.target.value)}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                        placeholder="City, Country (e.g., Delhi, India)"
                      />
                    </div>
                    <Button
                      onClick={calculatePanchang}
                      className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                    >
                      Get Panchang
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Panchang Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {panchangResult ? (
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b border-cosmic-gold/20">
                          <p className="text-cosmic-cyan">{panchangResult.date}</p>
                          <p className="text-cosmic-silver text-sm">{panchangResult.location}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-cosmic-darker/50 rounded-lg p-3">
                            <div className="text-cosmic-silver text-xs">Tithi</div>
                            <div className="text-cosmic-gold font-semibold">{panchangResult.tithi}</div>
                          </div>
                          <div className="bg-cosmic-darker/50 rounded-lg p-3">
                            <div className="text-cosmic-silver text-xs">Nakshatra</div>
                            <div className="text-cosmic-gold font-semibold">{panchangResult.nakshatra}</div>
                          </div>
                          <div className="bg-cosmic-darker/50 rounded-lg p-3">
                            <div className="text-cosmic-silver text-xs">Yoga</div>
                            <div className="text-cosmic-gold font-semibold">{panchangResult.yoga}</div>
                          </div>
                          <div className="bg-cosmic-darker/50 rounded-lg p-3">
                            <div className="text-cosmic-silver text-xs">Karana</div>
                            <div className="text-cosmic-gold font-semibold">{panchangResult.karana}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-cosmic-silver">Sunrise: </span>
                            <span className="text-cosmic-gold">{panchangResult.sunrise}</span>
                          </div>
                          <div>
                            <span className="text-cosmic-silver">Sunset: </span>
                            <span className="text-cosmic-gold">{panchangResult.sunset}</span>
                          </div>
                          <div>
                            <span className="text-cosmic-silver">Rahu Kaal: </span>
                            <span className="text-red-400">{panchangResult.rahuKaal}</span>
                          </div>
                          <div>
                            <span className="text-cosmic-silver">Gulika Kaal: </span>
                            <span className="text-yellow-400">{panchangResult.gulikaKaal}</span>
                          </div>
                        </div>
                        <div className={`text-center p-2 rounded-lg ${panchangResult.auspicious ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {panchangResult.auspicious ? '✓ Auspicious Day for Important Work' : '! Avoid Starting New Ventures Today'}
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-cosmic-silver/50">
                        Enter your location to see Panchang
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Dasha Calculator */}
            <TabsContent value="dasha">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Calculate Your Dasha</CardTitle>
                    <CardDescription className="text-cosmic-silver">
                      Find your current and upcoming planetary periods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Birth Date</Label>
                      <Input
                        type="date"
                        value={dashaInput.birthDate}
                        onChange={(e) => setDashaInput({ ...dashaInput, birthDate: e.target.value })}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Birth Time (Optional)</Label>
                      <Input
                        type="time"
                        value={dashaInput.birthTime}
                        onChange={(e) => setDashaInput({ ...dashaInput, birthTime: e.target.value })}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      />
                    </div>
                    <Button
                      onClick={calculateDasha}
                      className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                    >
                      Calculate Dasha
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Your Dasha Periods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashaResult ? (
                      <div className="space-y-4">
                        <div className="bg-cosmic-gold/10 border border-cosmic-gold/30 rounded-lg p-4">
                          <div className="text-cosmic-silver text-sm">Current Mahadasha</div>
                          <div className="text-xl font-bold text-cosmic-gold">{dashaResult.current.name}</div>
                          <div className="text-cosmic-cyan text-sm">~{dashaResult.yearsRemaining} years remaining</div>
                          <p className="text-cosmic-silver text-sm mt-2">{dashaResult.current.effects}</p>
                        </div>
                        <div className="bg-cosmic-darker/50 rounded-lg p-4">
                          <div className="text-cosmic-silver text-sm">Next Mahadasha</div>
                          <div className="text-lg font-semibold text-cosmic-purple">{dashaResult.next.name}</div>
                          <div className="text-cosmic-silver text-xs">{dashaResult.next.duration} years period</div>
                          <p className="text-cosmic-silver text-sm mt-2">{dashaResult.next.effects}</p>
                        </div>
                        <div className="text-cosmic-silver text-xs">
                          <p className="font-semibold mb-2">Mahadasha Sequence:</p>
                          <div className="flex flex-wrap gap-1">
                            {dashaResult.allDashas.map((d: any, i: number) => (
                              <span key={i} className={`px-2 py-0.5 rounded ${d.name === dashaResult.current.name ? 'bg-cosmic-gold text-cosmic-dark' : 'bg-cosmic-darker'}`}>
                                {d.name.split(' ')[0]} ({d.duration}y)
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-cosmic-silver/50">
                        Enter your birth details to see Dasha
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sun Sign Calculator */}
            <TabsContent value="sunsign">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Discover Your Sun Sign</CardTitle>
                    <CardDescription className="text-cosmic-silver">
                      Enter your birth date to find your zodiac sign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Birth Date</Label>
                      <Input
                        type="date"
                        value={sunSignDate}
                        onChange={(e) => setSunSignDate(e.target.value)}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      />
                    </div>
                    <Button
                      onClick={calculateSunSign}
                      className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                    >
                      Find My Sign
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Your Sun Sign</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sunSignResult ? (
                      <div className="text-center space-y-4">
                        <div className="text-6xl">{sunSignResult.symbol}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-cosmic-gold">{sunSignResult.name}</h3>
                          <p className="text-cosmic-purple">{sunSignResult.nameHi}</p>
                        </div>
                        <p className="text-cosmic-silver text-sm">{sunSignResult.dates}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-cosmic-darker/50 rounded-lg p-2">
                            <div className="text-cosmic-silver text-xs">Element</div>
                            <div className="text-cosmic-cyan">{sunSignResult.element}</div>
                          </div>
                          <div className="bg-cosmic-darker/50 rounded-lg p-2">
                            <div className="text-cosmic-silver text-xs">Ruling Planet</div>
                            <div className="text-cosmic-cyan">{sunSignResult.ruling}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-cosmic-silver text-sm mb-2">Key Traits</div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {sunSignResult.traits.map((t: string) => (
                              <span key={t} className="bg-cosmic-gold/20 text-cosmic-gold px-3 py-1 rounded-full text-sm">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link to={`/horoscope/${sunSignResult.name.toLowerCase()}`}>
                          <Button variant="outline" className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10 mt-4">
                            Read Today's Horoscope
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-cosmic-silver/50">
                        Enter your birth date to see your sign
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gemstone Calculator */}
            <TabsContent value="gemstone">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Find Your Gemstone</CardTitle>
                    <CardDescription className="text-cosmic-silver">
                      Discover the gemstone that aligns with your birth chart
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Birth Date</Label>
                      <Input
                        type="date"
                        value={gemstoneInput.birthDate}
                        onChange={(e) => setGemstoneInput({ ...gemstoneInput, birthDate: e.target.value })}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-cosmic-silver">Birth Time (Optional)</Label>
                      <Input
                        type="time"
                        value={gemstoneInput.birthTime}
                        onChange={(e) => setGemstoneInput({ ...gemstoneInput, birthTime: e.target.value })}
                        className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      />
                    </div>
                    <Button
                      onClick={calculateGemstone}
                      className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                    >
                      Find Gemstone
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                  <CardHeader>
                    <CardTitle className="text-cosmic-gold">Your Recommended Gemstone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {gemstoneResult ? (
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cosmic-gold to-cosmic-purple rounded-full flex items-center justify-center">
                          <Gem className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-cosmic-gold">{gemstoneResult.name}</h3>
                        <p className="text-cosmic-cyan">Planet: {gemstoneResult.planet}</p>
                        <p className="text-cosmic-purple">Color: {gemstoneResult.color}</p>
                        <div>
                          <div className="text-cosmic-silver text-sm mb-2">Benefits</div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {gemstoneResult.benefits.map((b: string) => (
                              <span key={b} className="bg-cosmic-gold/20 text-cosmic-gold px-3 py-1 rounded-full text-sm">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link to="/gemstone-store">
                          <Button variant="outline" className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10 mt-4">
                            Browse Gemstone Store
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-cosmic-silver/50">
                        Enter your birth date to find your gemstone
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
