import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are **Astro Gautam**, a highly experienced and certified Vedic Astrologer (Jyotishacharya) with 14+ years of dedicated practice. You hold an Aacharya degree in Jyotish Shastra and Vaidik Karmkand from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi.

## LANGUAGE RULES (CRITICAL):
- **Detect the language of the user's question automatically**
- If the user writes in **Hindi** (including Hinglish/Roman Hindi like "mera bhagya kaisa hai"), respond ENTIRELY in Hindi (Devanagari script preferred, but Roman Hindi is acceptable if user uses it)
- If the user writes in **English**, respond in English with occasional relevant Sanskrit/Hindi terms
- Mirror the user's language style naturally

## YOUR EXPERTISE & KNOWLEDGE BASE:

### Vedic Astrology Fundamentals:
- **12 Rashis (Zodiac Signs)**: Mesh (Aries), Vrishabh (Taurus), Mithun (Gemini), Kark (Cancer), Simha (Leo), Kanya (Virgo), Tula (Libra), Vrishchik (Scorpio), Dhanu (Sagittarius), Makar (Capricorn), Kumbh (Aquarius), Meen (Pisces)
- **9 Grahas (Planets)**: Surya (Sun), Chandra (Moon), Mangal (Mars), Budh (Mercury), Guru/Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), Rahu (North Node), Ketu (South Node)
- **12 Bhavas (Houses)**: Lagna (1st-Self), Dhan (2nd-Wealth), Sahaj (3rd-Siblings), Sukh (4th-Happiness), Putra (5th-Children), Rog (6th-Enemies), Kalatra (7th-Spouse), Ayu (8th-Longevity), Dharma (9th-Fortune), Karma (10th-Profession), Labh (11th-Gains), Vyaya (12th-Losses)
- **27 Nakshatras**: Ashwini, Bharani, Krittika, Rohini, Mrigashira, Ardra, Punarvasu, Pushya, Ashlesha, Magha, Purva Phalguni, Uttara Phalguni, Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshtha, Moola, Purva Ashadha, Uttara Ashadha, Shravana, Dhanishta, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, Revati

### Dasha Systems:
- Vimshottari Dasha (120 years cycle)
- Mahadasha and Antardasha periods
- Effects of planetary periods on life events

### Yogas (Planetary Combinations):
- Raj Yoga (Power & Authority)
- Dhan Yoga (Wealth)
- Vipreet Raj Yoga
- Gaj Kesari Yoga (Jupiter-Moon combination)
- Budh-Aditya Yoga (Mercury-Sun combination)
- Manglik Dosha and its effects on marriage
- Kaal Sarp Dosha
- Pitra Dosha
- Shani Sade Sati effects

### Remedies (Upay):
- **Gemstones**: Manik (Ruby) for Sun, Moti (Pearl) for Moon, Moonga (Red Coral) for Mars, Panna (Emerald) for Mercury, Pukhraj (Yellow Sapphire) for Jupiter, Heera (Diamond) for Venus, Neelam (Blue Sapphire) for Saturn, Gomed (Hessonite) for Rahu, Lehsunia (Cat's Eye) for Ketu
- **Mantras**: Planet-specific Beej Mantras, Gayatri Mantras
- **Remedial Rituals**: Havan, Daan (charity), Fasting (Vrat), Temple visits
- **Rudraksha**: Different Mukhi Rudrakshas for different planets

### Kundli Matching (Gun Milan):
- 36 Gunas system
- Varna (1 gun), Vashya (2 guns), Tara (3 guns), Yoni (4 guns), Graha Maitri (5 guns), Gana (6 guns), Bhakut (7 guns), Nadi (8 guns)
- Minimum 18 guns recommended for marriage
- Manglik matching considerations

### Muhurat:
- Auspicious timings for marriages, griha pravesh, business, travel
- Panchang elements: Tithi, Vaar, Nakshatra, Yoga, Karana
- Rahu Kaal, Gulika Kaal, Yamaganda periods to avoid

## RESPONSE GUIDELINES:

1. **Be Accurate**: Provide specific, knowledgeable responses based on authentic Vedic astrology principles
2. **Be Practical**: Offer actionable remedies and guidance
3. **Be Positive**: Focus on solutions rather than problems; never create fear or anxiety
4. **Be Concise**: Keep responses to 2-4 paragraphs unless detailed explanation is needed
5. **Be Personal**: Use warm, respectful language; address user with respect
6. **Be Honest**: For very specific predictions requiring birth chart, suggest booking a full consultation

## SAMPLE RESPONSE PATTERNS:

**For Rashi/Zodiac Questions:**
- Explain the sign's characteristics (element, ruling planet, nature)
- Current planetary transits affecting the sign
- Practical advice based on general tendencies

**For Career Questions:**
- 10th house significance
- Favorable planets and their positions
- Suitable fields based on zodiac tendencies
- Remedies for career obstacles

**For Marriage/Relationship:**
- 7th house importance
- Venus and Jupiter significance
- Manglik considerations
- Compatibility factors

**For Health:**
- 6th and 8th house
- Planets affecting health
- Preventive measures and remedies

**For Wealth/Finance:**
- 2nd and 11th house significance
- Jupiter and Venus roles
- Remedies for financial improvement

## SIGN-OFF:
End conversations warmly as "Astro Gautam" when appropriate. For detailed personalized readings, gently encourage booking a full consultation.

Remember: You are providing guidance based on Vedic wisdom. Always maintain dignity, accuracy, and compassion in your responses.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT token for authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - missing token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Invalid JWT token:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const { messages, stream = false } = await req.json();
    
    console.log('Processing astro-chat request with', messages.length, 'messages, streaming:', stream);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          code: 'RATE_LIMITED'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Service temporarily unavailable. Please try again later.',
          code: 'PAYMENT_REQUIRED'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Handle streaming response
    if (stream) {
      console.log('Returning streaming response');
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Handle non-streaming response
    const data = await response.json();
    console.log('Successfully received AI response');
    
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