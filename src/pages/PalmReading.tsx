import { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hand, Upload, Camera, Loader2, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PalmReading = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePalm = async () => {
    if (!image) {
      toast({
        title: 'No image',
        description: 'Please upload a palm image first',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis (will be replaced with actual OpenAI Vision API call)
    setTimeout(() => {
      setResult(`
## Palm Reading Analysis

### Life Line
Your life line is long and well-defined, indicating vitality and a strong life force. The smooth curve suggests a balanced approach to life with good physical health. The depth of the line indicates resilience and the ability to overcome challenges.

### Heart Line
A curved heart line rising toward the middle finger suggests you're romantic and emotionally expressive. You wear your heart on your sleeve and form deep, meaningful relationships. The clarity of this line indicates emotional stability.

### Head Line
Your head line shows a creative, imaginative mind. The slight downward slope indicates artistic tendencies and intuitive thinking. You process information both logically and emotionally, making you well-rounded in decision-making.

### Fate Line
A clear fate line starting from the base of your palm suggests a strong sense of purpose. Career success is indicated, especially in fields requiring creativity and human interaction. Major life decisions will generally work in your favor.

### Mount Analysis
- **Mount of Jupiter (Index Finger)**: Well-developed, indicating leadership qualities and ambition
- **Mount of Venus (Thumb base)**: Full and prominent, suggesting a loving nature and appreciation for beauty
- **Mount of Moon (Palm edge)**: Indicates strong intuition and imagination

### Key Insights
1. You have natural leadership abilities that may not be fully utilized
2. Creative pursuits will bring you satisfaction
3. Relationships are central to your happiness
4. The next 3-5 years show favorable conditions for major life changes
5. Health appears stable, but pay attention to stress management

### Recommendations
- Trust your intuition more in decision-making
- Pursue creative hobbies for mental balance
- Consider leadership roles in your career
- Maintain strong family connections
      `);
      setIsAnalyzing(false);
      toast({
        title: 'Analysis Complete!',
        description: 'Your palm reading is ready.',
      });
    }, 4000);
  };

  return (
    <Layout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Hand className="w-16 h-16 text-cosmic-gold" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-gold">AI Palm Reading</span>
            </h1>
            <p className="text-cosmic-silver max-w-2xl mx-auto">
              Upload a clear photo of your palm and let our AI analyze your life line, 
              heart line, head line, and more to reveal insights about your destiny.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader>
                <CardTitle className="text-cosmic-gold">Upload Palm Image</CardTitle>
                <CardDescription className="text-cosmic-silver">
                  Take a clear photo of your palm in good lighting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                
                {image ? (
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-cosmic-gold/50">
                      <img src={image} alt="Uploaded palm" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                        onClick={analyzePalm}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Hand className="w-4 h-4 mr-2" />
                            Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-cosmic-gold/30 hover:border-cosmic-gold/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-cosmic-gold/10 flex items-center justify-center">
                      <Camera className="w-10 h-10 text-cosmic-gold" />
                    </div>
                    <div className="text-center">
                      <p className="text-cosmic-gold font-medium">Click to upload</p>
                      <p className="text-cosmic-silver text-sm">or drag and drop</p>
                    </div>
                    <p className="text-cosmic-silver/50 text-xs">PNG, JPG up to 5MB</p>
                  </div>
                )}

                {/* Tips */}
                <div className="mt-6 bg-cosmic-darker/50 rounded-lg p-4">
                  <h4 className="text-cosmic-gold font-medium mb-2">Tips for best results:</h4>
                  <ul className="text-cosmic-silver text-sm space-y-1">
                    <li>• Use natural lighting</li>
                    <li>• Open your palm fully</li>
                    <li>• Capture the entire palm</li>
                    <li>• Keep the camera steady</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="bg-cosmic-dark/50 border-cosmic-gold/30">
              <CardHeader>
                <CardTitle className="text-cosmic-gold">Reading Results</CardTitle>
                <CardDescription className="text-cosmic-silver">
                  AI-powered palmistry analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="prose prose-invert prose-sm max-h-[500px] overflow-y-auto">
                      <div className="text-cosmic-silver whitespace-pre-wrap text-sm">
                        {result}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-cosmic-gold/20">
                      <Button variant="outline" className="flex-1 border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10">
                        <Download className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" className="flex-1 border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[500px] flex items-center justify-center text-cosmic-silver/50">
                    <div className="text-center">
                      <Hand className="w-20 h-20 mx-auto mb-4 opacity-30" />
                      <p>Upload a palm image to see your reading</p>
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

export default PalmReading;
