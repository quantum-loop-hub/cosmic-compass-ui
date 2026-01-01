import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, Gem, Calendar, Sparkles } from 'lucide-react';

const Calculators = () => {
  const [numerologyInput, setNumerologyInput] = useState({ name: '', birthDate: '' });
  const [numerologyResult, setNumerologyResult] = useState<any>(null);
  const [gemstoneInput, setGemstoneInput] = useState({ birthDate: '', birthTime: '' });
  const [gemstoneResult, setGemstoneResult] = useState<any>(null);

  const calculateNumerology = () => {
    if (!numerologyInput.name || !numerologyInput.birthDate) return;

    const lifePath = numerologyInput.birthDate.split('-').join('').split('').reduce((a, b) => a + parseInt(b), 0) % 9 || 9;
    
    setNumerologyResult({
      lifePath,
      destinyNumber: 7,
      soulUrge: 3,
      personality: 5,
      luckyNumbers: [3, 7, 12, 21],
      luckyColors: ['Gold', 'Purple', 'White'],
      luckyDays: ['Sunday', 'Thursday'],
      description: `Life Path ${lifePath} indicates a person who is intuitive, spiritual, and seeks deeper meaning in life. You are naturally analytical and have a strong desire for knowledge and wisdom.`,
    });
  };

  const calculateGemstone = () => {
    if (!gemstoneInput.birthDate) return;

    const month = parseInt(gemstoneInput.birthDate.split('-')[1]);
    const gemstones: Record<number, any> = {
      1: { name: 'Garnet', planet: 'Mars', benefits: ['Protection', 'Energy', 'Passion'] },
      2: { name: 'Amethyst', planet: 'Saturn', benefits: ['Peace', 'Wisdom', 'Protection'] },
      3: { name: 'Aquamarine', planet: 'Jupiter', benefits: ['Clarity', 'Courage', 'Communication'] },
      4: { name: 'Diamond', planet: 'Venus', benefits: ['Love', 'Purity', 'Strength'] },
      5: { name: 'Emerald', planet: 'Mercury', benefits: ['Growth', 'Wisdom', 'Patience'] },
      6: { name: 'Pearl', planet: 'Moon', benefits: ['Calm', 'Balance', 'Purity'] },
      7: { name: 'Ruby', planet: 'Sun', benefits: ['Passion', 'Protection', 'Prosperity'] },
      8: { name: 'Peridot', planet: 'Mercury', benefits: ['Healing', 'Protection', 'Harmony'] },
      9: { name: 'Blue Sapphire', planet: 'Saturn', benefits: ['Wisdom', 'Focus', 'Discipline'] },
      10: { name: 'Opal', planet: 'Venus', benefits: ['Creativity', 'Confidence', 'Love'] },
      11: { name: 'Topaz', planet: 'Jupiter', benefits: ['Joy', 'Abundance', 'Good Health'] },
      12: { name: 'Turquoise', planet: 'Jupiter', benefits: ['Protection', 'Luck', 'Success'] },
    };

    setGemstoneResult(gemstones[month] || gemstones[1]);
  };

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-16 h-16 text-cosmic-gold animate-glow-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Astrology Calculators</span>
            </h1>
            <p className="text-cosmic-silver max-w-2xl mx-auto">
              Discover your lucky numbers, gemstones, and auspicious timings with our free calculators.
            </p>
          </div>

          <Tabs defaultValue="numerology" className="space-y-8">
            <TabsList className="grid grid-cols-3 bg-cosmic-dark/50 border border-cosmic-gold/30">
              <TabsTrigger value="numerology" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                <Hash className="w-4 h-4 mr-2" />
                Numerology
              </TabsTrigger>
              <TabsTrigger value="gemstone" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                <Gem className="w-4 h-4 mr-2" />
                Gemstone
              </TabsTrigger>
              <TabsTrigger value="muhurat" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark">
                <Calendar className="w-4 h-4 mr-2" />
                Muhurat
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
                            {numerologyResult.luckyNumbers.map((n: number) => (
                              <span key={n} className="bg-cosmic-gold/20 text-cosmic-gold px-3 py-1 rounded-full text-sm">
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-cosmic-silver text-sm mb-1">Lucky Colors</div>
                          <div className="flex gap-2">
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

            {/* Muhurat Calculator */}
            <TabsContent value="muhurat">
              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                <CardHeader>
                  <CardTitle className="text-cosmic-gold">Muhurat Finder</CardTitle>
                  <CardDescription className="text-cosmic-silver">
                    Find auspicious timings for important events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-cosmic-gold mx-auto mb-4" />
                    <h3 className="text-xl text-cosmic-gold mb-2">Coming Soon</h3>
                    <p className="text-cosmic-silver">
                      Our Muhurat calculator is being enhanced with more features. Check back soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Calculators;
