import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const horoscopePredictions: Record<string, string[]> = {
  Aries: [
    "Bold energy surrounds you today. Take initiative in professional matters.",
    "A creative breakthrough awaits. Trust your instincts and move forward.",
    "Unexpected opportunities arise through social connections. Stay open."
  ],
  Taurus: [
    "Financial stability improves. Focus on long-term goals today.",
    "Patience pays off in relationships. Express your feelings gently.",
    "Home and comfort take priority. A perfect day for self-care."
  ],
  Gemini: [
    "Communication skills are heightened. Important conversations go well.",
    "Learning something new brings joy. Follow your curiosity.",
    "Social connections flourish. Networking opens unexpected doors."
  ],
  Cancer: [
    "Emotional depth strengthens bonds. Family matters bring happiness.",
    "Intuition guides you to the right decisions today.",
    "Creative projects benefit from your nurturing energy."
  ],
  Leo: [
    "Leadership qualities shine. Others look to you for inspiration.",
    "Romance and creativity intertwine beautifully today.",
    "Recognition for your efforts comes from unexpected sources."
  ],
  Virgo: [
    "Attention to detail reveals hidden opportunities.",
    "Health and wellness routines bring positive results.",
    "Analytical thinking solves a long-standing problem."
  ],
  Libra: [
    "Harmony and balance guide your decisions today.",
    "Partnerships strengthen through honest communication.",
    "Artistic pursuits bring deep satisfaction and peace."
  ],
  Scorpio: [
    "Transformation brings powerful insights. Embrace change.",
    "Deep connections form through vulnerability and trust.",
    "Research and investigation reveal valuable information."
  ],
  Sagittarius: [
    "Adventure calls! Travel or learning expands your horizons.",
    "Optimism attracts positive energy and good fortune.",
    "Philosophical insights bring clarity to complex situations."
  ],
  Capricorn: [
    "Discipline and determination lead to significant achievements.",
    "Career advancement is favored. Show your capabilities.",
    "Long-term planning bears fruit. Stay focused on goals."
  ],
  Aquarius: [
    "Innovation sets you apart from the crowd today.",
    "Community involvement brings fulfillment and new connections.",
    "Unexpected solutions arise through unconventional thinking."
  ],
  Pisces: [
    "Intuition and creativity flow freely. Trust your inner guidance.",
    "Spiritual practices bring profound peace and clarity.",
    "Compassion and empathy strengthen your relationships."
  ],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const resend = new Resend(RESEND_API_KEY);

    // Fetch all users with email enabled
    const { data: preferences, error } = await supabase
      .from('horoscope_preferences')
      .select('user_id, sun_sign, email_enabled')
      .eq('email_enabled', true);

    if (error) throw error;
    if (!preferences || preferences.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscribers found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user emails from auth
    let sentCount = 0;
    const errors: string[] = [];

    for (const pref of preferences) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(pref.user_id);
        if (!userData?.user?.email) continue;

        const predictions = horoscopePredictions[pref.sun_sign] || horoscopePredictions['Aries'];
        const todayPrediction = predictions[Math.floor(Math.random() * predictions.length)];

        const today = new Date().toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });

        await resend.emails.send({
          from: 'Astro Vichar <onboarding@resend.dev>',
          to: [userData.user.email],
          subject: `🌟 Daily Horoscope for ${pref.sun_sign} - ${today}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Segoe UI', sans-serif; background: #0a0a0f; color: #e5e5e5; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 16px; padding: 32px; border: 1px solid #d4af37; }
                .header { text-align: center; margin-bottom: 24px; }
                .header h1 { color: #d4af37; margin: 0; font-size: 28px; }
                .sign-symbol { font-size: 64px; display: block; margin: 16px 0; }
                .prediction { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 20px 0; font-size: 18px; line-height: 1.8; border-left: 4px solid #d4af37; }
                .footer { text-align: center; margin-top: 24px; color: #888; font-size: 14px; }
                .cta { display: inline-block; background: linear-gradient(135deg, #d4af37, #b8860b); color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🌟 Daily Horoscope</h1>
                  <p style="color: #888;">${today}</p>
                  <span class="sign-symbol">${getSymbol(pref.sun_sign)}</span>
                  <h2 style="color: #d4af37; margin: 0;">${pref.sun_sign}</h2>
                </div>
                <div class="prediction">${todayPrediction}</div>
                <div style="text-align: center;">
                  <a href="#" class="cta">Read Full Horoscope</a>
                </div>
                <div class="footer">
                  <p>🙏 Astro Vichar - Your Cosmic Guide</p>
                  <p style="font-size: 12px;">To unsubscribe, update your preferences in the app.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send to ${pref.user_id}:`, emailError);
        errors.push(pref.user_id);
      }
    }

    return new Response(JSON.stringify({ 
      message: `Sent ${sentCount} horoscope emails`, 
      errors: errors.length > 0 ? errors : undefined 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in daily-horoscope:', error);
    return new Response(JSON.stringify({ error: 'An error occurred processing your request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function getSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
  };
  return symbols[sign] || '⭐';
}
