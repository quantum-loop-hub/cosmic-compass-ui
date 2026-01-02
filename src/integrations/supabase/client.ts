import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://enlxxeyzthcphnettkeu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubHh4ZXl6dGhjcGhuZXR0a2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDY1NDQsImV4cCI6MjA4MjkyMjU0NH0.ilgqW9DOwg0yOlLcMk9JQFwZlGovAHVNF0ZX1QBm70E";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
