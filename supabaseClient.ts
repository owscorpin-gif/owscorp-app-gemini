
import { createClient } from '@supabase/supabase-js';

// Initialize with placeholder values.
let supabaseUrl = 'https://placeholderproject.supabase.co';
// Use a structurally valid placeholder JWT. The previous one was malformed and caused a crash.
let supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.placeholder_signature';

// Safely check if we are in a Node-like environment with process.env available.
// This prevents ReferenceError in a pure browser environment.
if (typeof process !== 'undefined' && process.env) {
  // If the environment variables are set, use them.
  if (process.env.SUPABASE_URL) {
    supabaseUrl = process.env.SUPABASE_URL;
  }
  if (process.env.SUPABASE_ANON_KEY) {
    supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  }
}

// Log a warning if the app is still using placeholder credentials.
if (supabaseUrl === 'https://placeholderproject.supabase.co') {
  console.error(
    'Supabase URL and Anon Key are not configured. Authentication will not work. Please update your environment variables with your real credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);