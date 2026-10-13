import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
// Campus ID is turned into a hidden email so Supabase login can be used.
export const toEmail = (id) => `${id.trim().toLowerCase()}@fixit-campus.app`;
