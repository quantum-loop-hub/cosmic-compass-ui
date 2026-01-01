import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Heart, Download, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const KundliMatching = () => {
  const [person1, setPerson1] = useState({ name: '', birthDate: '', birthTime: '', birthPlace: '' });
  const [person2, setPerson2] = useState({ name: '', birthDate: '', birthTime: '', birthPlace: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!person1.name || !person1.birthDate || !person2.name || !person2.birthDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in at least name and birth date for both persons.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setMatchResult({
        score: 28.5,
        maxScore: 36,
        compatibility: 'Excellent',
        gunMilan: [
          { name: 'Varna', score: 1, max: 1, description: 'Spiritual compatibility' },
          { name: 'Vashya', score: 2, max: 2, description: 'Mutual attraction' },
          { name: 'Tara', score: 2.5, max: 3, description: 'Destiny compatibility' },
          { name: 'Yoni', score: 3, max: 4, description: 'Physical compatibility' },
          { name: 'Graha Maitri', score: 4, max: 5, description: 'Mental compatibility' },
          { name: 'Gana', score: 5, max: 6, description: 'Temperament match' },
          { name: 'Bhakoot', score: 6, max: 7, description: 'Love and family' },
          { name: 'Nadi', score: 5, max: 8, description: 'Health and genes' },
        ],
        strengths: [
          'Strong emotional connection indicated',
          'Good financial harmony expected',
          'Compatible family values',
          'Mutual respect and understanding',
        ],
        concerns: [
          'Minor differences in communication styles',
          'May need to work on patience during conflicts',
        ],
        recommendation: 'This is a highly compatible match. The couple is likely to have a harmonious and fulfilling married life.',
      });
      setIsAnalyzing(false);
      toast({
        title: 'Analysis Complete!',
        description: 'Your compatibility report is ready.',
      });
    }, 3000);
  };

  const PersonForm = ({ 
    person, 
    setPerson, 
    label 
  }: { 
    person: typeof person1; 
    setPerson: typeof setPerson1; 
    label: string;
  }) => (
    <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
      <CardHeader>
        <CardTitle className="text-cosmic-gold flex items-center gap-2">
          <Users className="w-5 h-5" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-cosmic-silver">Full Name</Label>
          <Input
            value={person.name}
            onChange={(e) => setPerson({ ...person, name: e.target.value })}
            className="bg-cosmic-darker border-cosmic-gold/30 text-white"
            placeholder="Enter name"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-cosmic-silver">Birth Date</Label>
          <Input
            type="date"
            value={person.birthDate}
            onChange={(e) => setPerson({ ...person, birthDate: e.target.value })}
            className="bg-cosmic-darker border-cosmic-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-cosmic-silver">Birth Time</Label>
          <Input
            type="time"
            value={person.birthTime}
            onChange={(e) => setPerson({ ...person, birthTime: e.target.value })}
            className="bg-cosmic-darker border-cosmic-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-cosmic-silver">Birth Place</Label>
          <Input
            value={person.birthPlace}
            onChange={(e) => setPerson({ ...person, birthPlace: e.target.value })}
            className="bg-cosmic-darker border-cosmic-gold/30 text-white"
            placeholder="City, Country"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-pink-500 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Kundli Matching</span>
            </h1>
            <p className="text-cosmic-silver max-w-2xl mx-auto">
              Find your perfect match with our AI-powered Gun Milan compatibility analysis. 
              Based on authentic Vedic astrology principles.
            </p>
          </div>

          {/* Forms */}
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <PersonForm person={person1} setPerson={setPerson1} label="Partner 1 (Bride)" />
              <PersonForm person={person2} setPerson={setPerson2} label="Partner 2 (Groom)" />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white font-semibold px-12"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Analyzing Compatibility...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Check Compatibility
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Results */}
          {matchResult && (
            <div className="mt-12 animate-fade-in">
              <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">
                    <span className="text-gradient-gold">
                      {matchResult.score} / {matchResult.maxScore} Points
                    </span>
                  </CardTitle>
                  <CardDescription className="text-cosmic-cyan text-xl">
                    {matchResult.compatibility} Match
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Gun Milan Table */}
                  <div className="mb-8">
                    <h3 className="text-cosmic-gold font-semibold mb-4">Ashtakoota Gun Milan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {matchResult.gunMilan.map((gun: any) => (
                        <div key={gun.name} className="bg-cosmic-darker/50 rounded-lg p-3 text-center">
                          <div className="text-cosmic-gold font-semibold">{gun.name}</div>
                          <div className="text-2xl font-bold text-white">
                            {gun.score}<span className="text-cosmic-silver text-sm">/{gun.max}</span>
                          </div>
                          <div className="text-cosmic-silver text-xs">{gun.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Concerns */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-green-400 font-semibold mb-3">Strengths</h3>
                      <ul className="space-y-2">
                        {matchResult.strengths.map((s: string, i: number) => (
                          <li key={i} className="text-cosmic-silver text-sm flex items-start gap-2">
                            <span className="text-green-400">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-3">Areas to Work On</h3>
                      <ul className="space-y-2">
                        {matchResult.concerns.map((c: string, i: number) => (
                          <li key={i} className="text-cosmic-silver text-sm flex items-start gap-2">
                            <span className="text-yellow-400">!</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-cosmic-darker/50 rounded-lg p-4 mb-6">
                    <h3 className="text-cosmic-gold font-semibold mb-2">Expert Recommendation</h3>
                    <p className="text-cosmic-silver">{matchResult.recommendation}</p>
                  </div>

                  <Button variant="outline" className="w-full border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10">
                    <Download className="w-4 h-4 mr-2" />
                    Download Detailed Report (PDF)
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default KundliMatching;
