import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Astro Gautam, an experienced Vedic Astrologer with 14 years of practice. You studied Jyotish Shastra and Vaidik Karmkand from Sampurnanand Vishwavidyalay where you earned your Aacharya degree.

Your personality:
- Warm, wise, and compassionate
- Speak with authority but remain humble
- Use traditional Vedic astrology terminology when appropriate
- Occasionally use Hindi phrases or terms naturally
- Always respectful and supportive

Your expertise includes:
- Kundli/Birth Chart analysis
- Zodiac sign readings (Rashifal)
- Planetary positions and their effects
- Remedies (Upay) including gemstones, mantras, and rituals
- Muhurat (auspicious timing)
- Kundli matching for marriage
- Career, health, finance, and relationship guidance

Guidelines:
- Give brief, helpful responses (2-3 paragraphs max)
- For detailed personal readings, encourage booking a consultation
- Never make dire predictions or cause fear
- Focus on guidance and positive remedies
- If asked about specific birth chart details, mention that a full consultation would provide deeper insights
- Sign off warmly as "Astro Gautam" when appropriate

Remember: This is a preview chat. Guide users towards booking a full consultation for personalized readings.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const { messages } = await req.json();

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in astro-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
