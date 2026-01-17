import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, Download, Share2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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

  const downloadPDF = () => {
    if (!kundliResult) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Helper function to add centered text
    const addCenteredText = (text: string, y: number, fontSize: number = 12) => {
      doc.setFontSize(fontSize);
      doc.text(text, pageWidth / 2, y, { align: 'center' });
    };

    // Helper function to add a section header
    const addSectionHeader = (text: string) => {
      yPos += 10;
      doc.setFillColor(218, 165, 32); // Gold color
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(text, margin + 3, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      yPos += 10;
    };

    // Title
    doc.setFillColor(30, 30, 50);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(218, 165, 32);
    addCenteredText('ASTRO VICHAR', 15, 20);
    doc.setTextColor(255, 255, 255);
    addCenteredText('Vedic Birth Chart (Kundli)', 28, 14);
    
    yPos = 50;
    doc.setTextColor(0, 0, 0);

    // Birth Details Section
    addSectionHeader('Birth Details');
    doc.setFontSize(10);
    doc.text(`Name: ${kundliResult.name}`, margin, yPos);
    yPos += 6;
    doc.text(`Date of Birth: ${new Date(kundliResult.birthDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, yPos);
    yPos += 6;
    doc.text(`Time of Birth: ${kundliResult.birthTime}`, margin, yPos);
    yPos += 6;
    doc.text(`Place of Birth: ${kundliResult.birthPlace}`, margin, yPos);
    yPos += 6;

    // Basic Chart Info
    addSectionHeader('Basic Chart Information');
    doc.setFontSize(10);
    doc.text(`Sun Sign (Rashi): ${kundliResult.sunSign}`, margin, yPos);
    yPos += 6;
    doc.text(`Moon Sign (Chandra Rashi): ${kundliResult.moonSign}`, margin, yPos);
    yPos += 6;
    doc.text(`Ascendant (Lagna): ${kundliResult.ascendant}`, margin, yPos);
    yPos += 6;

    // Planetary Positions
    addSectionHeader('Planetary Positions (Graha Sthiti)');
    doc.setFontSize(9);
    kundliResult.planets.forEach((planet: any) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${planet.name}:`, margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`${planet.sign} (House ${planet.house})`, margin + 50, yPos);
      yPos += 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Effect: ${planet.effects}`, margin + 5, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      yPos += 7;
    });

    // Predictions
    doc.addPage();
    yPos = 20;
    addSectionHeader('Life Predictions');
    doc.setFontSize(9);
    Object.entries(kundliResult.predictions).forEach(([key, value]) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 5;
      const lines = doc.splitTextToSize(value as string, pageWidth - 2 * margin);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 5 + 5;
    });

    // Remedies
    addSectionHeader('Recommended Remedies');
    doc.setFontSize(9);
    kundliResult.remedies.forEach((remedy: string, index: number) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${remedy}`, margin, yPos);
      yPos += 6;
    });

    // Lucky Details
    addSectionHeader('Lucky Details');
    doc.setFontSize(9);
    doc.text(`Lucky Numbers: ${kundliResult.luckyDetails.numbers.join(', ')}`, margin, yPos);
    yPos += 6;
    doc.text(`Lucky Colors: ${kundliResult.luckyDetails.colors.join(', ')}`, margin, yPos);
    yPos += 6;
    doc.text(`Lucky Days: ${kundliResult.luckyDetails.days.join(', ')}`, margin, yPos);
    yPos += 6;
    doc.text(`Lucky Direction: ${kundliResult.luckyDetails.direction}`, margin, yPos);
    yPos += 6;
    doc.text(`Recommended Gemstone: ${kundliResult.luckyDetails.gemstone}`, margin, yPos);

    // Footer on each page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by Astro Vichar | astrovichar8@gmail.com | Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

    // Save the PDF
    doc.save(`Kundli_${kundliResult.name.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: 'PDF Downloaded!',
      description: 'Your Kundli has been saved as PDF.',
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
