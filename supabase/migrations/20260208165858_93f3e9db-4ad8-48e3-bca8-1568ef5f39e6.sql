-- Fix horoscope_preferences RLS policies - change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.horoscope_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.horoscope_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.horoscope_preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON public.horoscope_preferences;

CREATE POLICY "Users can view their own preferences"
ON public.horoscope_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.horoscope_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.horoscope_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
ON public.horoscope_preferences FOR DELETE
USING (auth.uid() = user_id);