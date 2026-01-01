import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, Download, Share2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FreeKundli = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [kundliResult, setKundliResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields to generate your Kundli.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (will be replaced with actual API call)
    setTimeout(() => {
      setKundliResult(`
## Birth Chart Analysis for ${formData.name}

**Birth Details:**
- Date: ${formData.birthDate}
- Time: ${formData.birthTime}
- Place: ${formData.birthPlace}

### Sun Sign: Leo (Simha)
Your Sun is placed in Leo, indicating a strong personality with natural leadership qualities. You are creative, generous, and have a warm heart.

### Moon Sign: Cancer (Karka)
The Moon in Cancer brings emotional depth and strong intuition. Family and home are important to you.

### Ascendant (Lagna): Virgo (Kanya)
With Virgo rising, you present yourself as analytical, practical, and detail-oriented to the world.

### Key Planetary Positions:
- **Mars in Aries**: Strong willpower and initiative
- **Venus in Libra**: Harmonious relationships and artistic abilities
- **Jupiter in Sagittarius**: Wisdom and spiritual growth
- **Saturn in Capricorn**: Discipline and long-term success

### Favorable Periods:
The next 6 months are excellent for career advancement and personal growth. Jupiter's transit supports education and travel.

### Recommended Remedies:
1. Wear a Yellow Sapphire for enhanced wisdom
2. Chant the Gayatri Mantra daily
3. Donate to educational causes on Thursdays
      `);
      setIsGenerating(false);
      toast({
        title: 'Kundli Generated!',
        description: 'Your personalized birth chart is ready.',
      });
    }, 3000);
  };

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <FileText className="w-16 h-16 text-cosmic-gold" />
                <Sparkles className="w-6 h-6 text-cosmic-cyan absolute -top-1 -right-1 animate-twinkle" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Free Kundli Generator</span>
            </h1>
            <p className="text-cosmic-silver max-w-2xl mx-auto">
              Get your detailed Vedic birth chart with AI-powered interpretations. 
              Enter your birth details below for instant analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader>
                <CardTitle className="text-cosmic-gold">Birth Details</CardTitle>
                <CardDescription className="text-cosmic-silver">
                  Enter accurate details for precise predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-cosmic-silver">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-cosmic-silver">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthTime" className="text-cosmic-silver">Birth Time</Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                      className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthPlace" className="text-cosmic-silver">Birth Place</Label>
                    <Input
                      id="birthPlace"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="bg-cosmic-darker border-cosmic-gold/30 text-white"
                      placeholder="City, Country"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Generating Kundli...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Kundli
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result */}
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader>
                <CardTitle className="text-cosmic-gold">Your Birth Chart</CardTitle>
                <CardDescription className="text-cosmic-silver">
                  AI-powered Vedic interpretation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {kundliResult ? (
                  <div className="space-y-4">
                    <div className="prose prose-invert prose-sm max-h-[400px] overflow-y-auto">
                      <div className="text-cosmic-silver whitespace-pre-wrap text-sm">
                        {kundliResult}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-cosmic-gold/20">
                      <Button variant="outline" className="flex-1 border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="flex-1 border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-cosmic-silver/50">
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Enter your birth details to generate your Kundli</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FreeKundli;
