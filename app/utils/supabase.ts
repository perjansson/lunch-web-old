import { createClient } from "@supabase/supabase-js";

const isServer = typeof window === "undefined";
const { env } = isServer ? process : (window as unknown as any);

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing Supabase config url: ${supabaseUrl} key: ${supabaseKey}`
  );
}

export default createClient(supabaseUrl, supabaseKey);
