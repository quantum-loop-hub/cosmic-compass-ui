import { useState, useRef } from 'react';
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
  const [kundliResult, setKundliResult] = useState<any>(null);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

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
    
    // Simulate AI generation
    setTimeout(() => {
      const birthDateObj = new Date(formData.birthDate);
      const month = birthDateObj.getMonth() + 1;
      
      // Determine sun sign based on date
      const sunSigns = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
      const sunSignIndex = (month + 9) % 12;
      
      // Determine moon sign (simplified calculation)
      const moonSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const moonSignIndex = (birthDateObj.getDate() + month) % 12;
      
      // Determine ascendant based on time
      const hour = parseInt(formData.birthTime.split(':')[0]);
      const ascendantIndex = (hour + month) % 12;
      const ascendants = ['Aries (Mesh)', 'Taurus (Vrishabh)', 'Gemini (Mithun)', 'Cancer (Karka)', 'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchik)', 'Sagittarius (Dhanu)', 'Capricorn (Makar)', 'Aquarius (Kumbh)', 'Pisces (Meen)'];

      setKundliResult({
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        sunSign: sunSigns[sunSignIndex],
        moonSign: moonSigns[moonSignIndex],
        ascendant: ascendants[ascendantIndex],
        planets: [
          { name: 'Sun (Surya)', sign: sunSigns[sunSignIndex], house: 1, effects: 'Strong willpower and leadership qualities' },
          { name: 'Moon (Chandra)', sign: moonSigns[moonSignIndex], house: 4, effects: 'Emotional depth and strong intuition' },
          { name: 'Mars (Mangal)', sign: 'Aries', house: 5, effects: 'Energy, courage, and competitive spirit' },
          { name: 'Mercury (Budh)', sign: 'Gemini', house: 3, effects: 'Excellent communication and analytical skills' },
          { name: 'Jupiter (Guru)', sign: 'Sagittarius', house: 9, effects: 'Wisdom, spirituality, and good fortune' },
          { name: 'Venus (Shukra)', sign: 'Libra', house: 7, effects: 'Love, beauty, and harmonious relationships' },
          { name: 'Saturn (Shani)', sign: 'Capricorn', house: 10, effects: 'Discipline, hard work, and career success' },
          { name: 'Rahu', sign: 'Gemini', house: 3, effects: 'Unconventional thinking and foreign connections' },
          { name: 'Ketu', sign: 'Sagittarius', house: 9, effects: 'Spiritual growth and past life karma' },
        ],
        predictions: {
          career: 'Your chart indicates strong potential for leadership roles. The period ahead is favorable for career advancement and recognition.',
          relationships: 'Venus placement suggests harmonious relationships. Marriage and partnerships will bring happiness and stability.',
          health: 'Overall good health indicated. Pay attention to stress management and maintain regular exercise.',
          finance: 'Jupiter\'s position favors financial growth. Investments made during this period are likely to yield good returns.',
          spirituality: 'Strong inclination towards spiritual practices. Meditation and yoga will bring inner peace.',
        },
        remedies: [
          'Wear a Yellow Sapphire (Pukhraj) for Jupiter\'s blessings',
          'Chant Gayatri Mantra 108 times daily',
          'Donate to educational causes on Thursdays',
          'Feed birds and animals regularly',
          'Perform Surya Namaskar at sunrise',
        ],
        luckyDetails: {
          numbers: [3, 7, 9, 12, 21],
          colors: ['Gold', 'Yellow', 'Orange'],
          days: ['Thursday', 'Sunday'],
          direction: 'North-East',
          gemstone: 'Yellow Sapphire',
        },
      });
      setIsGenerating(false);
      toast({
        title: 'Kundli Generated!',
        description: 'Your personalized birth chart is ready.',
      });
    }, 3000);
  };

  // Sanitize name for filename - allow only alphanumeric, underscore, dash
  const sanitizeName = (name: string): string => {
    return name
      .replace(/[^a-zA-Z0-9_\s-]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);
  };

  const downloadPDF = () => {
    if (!kundliResult) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Download Failed',
        description: 'Please allow popups to download PDF.',
        variant: 'destructive',
      });
      return;
    }

    const sanitizedName = sanitizeName(kundliResult.name);
    const formattedDate = new Date(kundliResult.birthDate).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    // Generate HTML content for the PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Kundli_${sanitizedName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; color: #1a1a2e; padding: 20px; }
    .header { background: #1a1a2e; color: #daa520; text-align: center; padding: 20px; margin-bottom: 20px; }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header h2 { font-size: 14px; color: #fff; font-weight: normal; }
    .section { margin-bottom: 15px; }
    .section-header { background: #daa520; color: #1a1a2e; padding: 8px 12px; font-weight: bold; font-size: 14px; margin-bottom: 10px; }
    .content { padding: 0 12px; font-size: 11px; line-height: 1.6; }
    .content p { margin-bottom: 5px; }
    .planet { margin-bottom: 8px; }
    .planet-name { font-weight: bold; }
    .planet-effect { color: #666; font-size: 10px; margin-left: 10px; }
    .prediction { margin-bottom: 10px; }
    .prediction-title { font-weight: bold; text-transform: capitalize; }
    .remedy { margin-bottom: 5px; }
    .footer { text-align: center; font-size: 9px; color: #999; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; }
    @media print {
      body { padding: 0; }
      .header { margin-bottom: 15px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ASTRO VICHAR</h1>
    <h2>Vedic Birth Chart (Kundli)</h2>
  </div>

  <div class="section">
    <div class="section-header">Birth Details</div>
    <div class="content">
      <p><strong>Name:</strong> ${kundliResult.name}</p>
      <p><strong>Date of Birth:</strong> ${formattedDate}</p>
      <p><strong>Time of Birth:</strong> ${kundliResult.birthTime}</p>
      <p><strong>Place of Birth:</strong> ${kundliResult.birthPlace}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-header">Basic Chart Information</div>
    <div class="content">
      <p><strong>Sun Sign (Rashi):</strong> ${kundliResult.sunSign}</p>
      <p><strong>Moon Sign (Chandra Rashi):</strong> ${kundliResult.moonSign}</p>
      <p><strong>Ascendant (Lagna):</strong> ${kundliResult.ascendant}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-header">Planetary Positions (Graha Sthiti)</div>
    <div class="content">
      ${kundliResult.planets.map((planet: any) => `
        <div class="planet">
          <span class="planet-name">${planet.name}:</span> ${planet.sign} (House ${planet.house})
          <div class="planet-effect">Effect: ${planet.effects}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-header">Life Predictions</div>
    <div class="content">
      ${Object.entries(kundliResult.predictions).map(([key, value]) => `
        <div class="prediction">
          <span class="prediction-title">${key}:</span> ${value}
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-header">Recommended Remedies</div>
    <div class="content">
      ${kundliResult.remedies.map((remedy: string, index: number) => `
        <div class="remedy">${index + 1}. ${remedy}</div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-header">Lucky Details</div>
    <div class="content">
      <p><strong>Lucky Numbers:</strong> ${kundliResult.luckyDetails.numbers.join(', ')}</p>
      <p><strong>Lucky Colors:</strong> ${kundliResult.luckyDetails.colors.join(', ')}</p>
      <p><strong>Lucky Days:</strong> ${kundliResult.luckyDetails.days.join(', ')}</p>
      <p><strong>Lucky Direction:</strong> ${kundliResult.luckyDetails.direction}</p>
      <p><strong>Recommended Gemstone:</strong> ${kundliResult.luckyDetails.gemstone}</p>
    </div>
  </div>

  <div class="footer">
    Generated by Astro Vichar | astrovichar8@gmail.com
  </div>

  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() {
        window.close();
      };
    };
  </script>
</body>
</html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast({
      title: 'PDF Ready!',
      description: 'Use "Save as PDF" in the print dialog to download.',
    });
  };

  const formatResult = () => {
    if (!kundliResult) return '';
    
    return `
## Birth Chart Analysis for ${kundliResult.name}

**Birth Details:**
- Date: ${new Date(kundliResult.birthDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
- Time: ${kundliResult.birthTime}
- Place: ${kundliResult.birthPlace}

### Sun Sign: ${kundliResult.sunSign}
Your Sun is placed in ${kundliResult.sunSign}, indicating strong personality traits and life direction.

### Moon Sign: ${kundliResult.moonSign}
The Moon in ${kundliResult.moonSign} brings emotional depth and influences your mental state.

### Ascendant (Lagna): ${kundliResult.ascendant}
With ${kundliResult.ascendant} rising, you present yourself with these qualities to the world.

### Key Planetary Positions:
${kundliResult.planets.map((p: any) => `- **${p.name}** in ${p.sign}: ${p.effects}`).join('\n')}

### Predictions:
- **Career:** ${kundliResult.predictions.career}
- **Relationships:** ${kundliResult.predictions.relationships}
- **Health:** ${kundliResult.predictions.health}
- **Finance:** ${kundliResult.predictions.finance}

### Recommended Remedies:
${kundliResult.remedies.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

### Lucky Details:
- Lucky Numbers: ${kundliResult.luckyDetails.numbers.join(', ')}
- Lucky Colors: ${kundliResult.luckyDetails.colors.join(', ')}
- Lucky Days: ${kundliResult.luckyDetails.days.join(', ')}
    `;
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
                      className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                      placeholder="Enter your name"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-cosmic-silver">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthTime" className="text-cosmic-silver">Birth Time</Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                      className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthPlace" className="text-cosmic-silver">Birth Place</Label>
                    <Input
                      id="birthPlace"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                      placeholder="City, Country"
                      maxLength={200}
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
                    <div ref={printRef} className="prose prose-invert prose-sm max-h-[400px] overflow-y-auto">
                      <div className="text-cosmic-silver whitespace-pre-wrap text-sm">
                        {formatResult()}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-cosmic-gold/20">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10"
                        onClick={downloadPDF}
                      >
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
