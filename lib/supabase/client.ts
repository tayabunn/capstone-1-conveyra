import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ghbcjaduaipyhzhclqwz.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Hd2xZ0y2hYVVT599SIhkig_3YfIQboJ";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
