import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env",
  );
}

/** @see frontend/supabase/profiles.sql */
export const PROFILES_TABLE = "profiles";

/** @see frontend/supabase/community_reports.sql */
export const REPORTS_TABLE = "community_reports";

/** Storage bucket for report evidence images */
export const REPORT_EVIDENCE_BUCKET = "report-evidence";

// Database only — login/signup use the profiles table, not Supabase Auth
const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export default supabase;
