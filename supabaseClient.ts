
import { createClient } from '@supabase/supabase-js';

// Initialize with placeholder values.
let supabaseUrl = 'https://placeholderproject.supabase.co';
// Use a structurally valid placeholder JWT. The 'ref' in the payload now
// correctly matches the project ID in the supabaseUrl, which fixes the crash.
let supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVycHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE5MDAwMDAwMDB9.placeholder_signature';

// Safely check for and use environment variables. This pattern avoids ReferenceError
// in browser environments that might not have `process` defined, and also avoids
// TypeError if `process` exists but `process.env` does not.
try {
  if (process.env.SUPABASE_URL) {
    supabaseUrl = process.env.SUPABASE_URL;
  }
  if (process.env.SUPABASE_ANON_KEY) {
    supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  }
} catch (e) {
  // This block can be empty. If process or process.env are not defined,
  // a ReferenceError will be caught, and the placeholder values will be used.
  // This is expected and safe behavior in a browser-only context.
}

// The warning for placeholder credentials has been removed to avoid confusion
// in the sandboxed environment where placeholders are expected to be used.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);