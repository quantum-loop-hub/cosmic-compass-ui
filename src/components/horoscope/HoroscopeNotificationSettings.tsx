import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const zodiacSymbols: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const HoroscopeNotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sunSign, setSunSign] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('horoscope_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setSunSign((data as any).sun_sign || '');
        setEmailEnabled((data as any).email_enabled ?? true);
        setExists(true);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user || !sunSign) {
      toast({ title: 'Select Sign', description: 'Please choose your sun sign.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload = { user_id: user.id, sun_sign: sunSign, email_enabled: emailEnabled } as any;

    if (exists) {
      const { error } = await supabase
        .from('horoscope_preferences')
        .update({ sun_sign: sunSign, email_enabled: emailEnabled } as any)
        .eq('user_id', user.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update preferences.', variant: 'destructive' });
      } else {
        toast({ title: 'Updated!', description: `Daily horoscope for ${sunSign} ${emailEnabled ? 'enabled' : 'disabled'}.` });
      }
    } else {
      const { error } = await supabase.from('horoscope_preferences').insert(payload);
      if (error) {
        toast({ title: 'Error', description: 'Failed to save preferences.', variant: 'destructive' });
      } else {
        setExists(true);
        toast({ title: 'Subscribed!', description: `You'll receive daily horoscope for ${sunSign}.` });
      }
    }
    setSaving(false);
  };

  if (!user) return null;
  if (loading) return <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <Card className="cosmic-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-lg">
          <Sun className="w-5 h-5" />
          Daily Horoscope Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Get personalized daily horoscope predictions delivered to your email.
        </p>

        <div className="space-y-2">
          <Label className="text-foreground">Your Sun Sign</Label>
          <Select value={sunSign} onValueChange={setSunSign}>
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select your zodiac sign" />
            </SelectTrigger>
            <SelectContent>
              {zodiacSigns.map(sign => (
                <SelectItem key={sign} value={sign}>
                  {zodiacSymbols[sign]} {sign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email-toggle" className="text-foreground flex items-center gap-2">
            {emailEnabled ? <Bell className="w-4 h-4 text-primary" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
            Email notifications
          </Label>
          <Switch
            id="email-toggle"
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
          />
        </div>

        <Button onClick={handleSave} disabled={saving || !sunSign} className="w-full btn-cosmic">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {exists ? 'Update Preferences' : 'Subscribe'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HoroscopeNotificationSettings;
