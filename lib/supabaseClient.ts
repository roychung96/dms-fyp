// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''; // Replace
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
