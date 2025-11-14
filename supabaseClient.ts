
import { createClient } from '@supabase/supabase-js';

// User-provided Supabase credentials.
// Authentication should now work correctly with these values.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHh1bW52cHR4cW5xcWxyaHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMzEwMzgsImV4cCI6MjA3NzcwNzAzOH0.SYabc3B9oL-le44zXmHWChtKwGOmwwfpDWMFKNaHxJ8';
const supabaseUrl = 'https://tkdxumnvptxqnqqlrhzr.supabase.co';

// Create and export the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
