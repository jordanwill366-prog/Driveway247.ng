import { createClient } from "@supabase/supabase-js";

// Safe retrieval of environment configuration with static fallbacks
const getSupabaseConfig = () => {
  let url = 'https://mfwjcfrgpmcrzmbduxja.supabase.co';
  let anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1md2pjZnJncG1jcnptYmR1eGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjU5NDAsImV4cCI6MjA5NTY0MTk0MH0.KEfFQL6Dq74AuE4DuaEuQvP1Qv2-Fk6O_BackuRfLJo';

  if (typeof process !== 'undefined' && process.env) {
    if (process.env['NEXT_PUBLIC_SUPABASE_URL']) {
      url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
    }
    if (process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
      anonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    }
  }

  return { url, anonKey };
};

const config = getSupabaseConfig();

export const supabase = createClient(config.url, config.anonKey);
