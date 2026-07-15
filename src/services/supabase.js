import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://aolwnnymiepciaehkhgo.supabase.co";

const supabaseKey =
  "sb_publishable_pIVNl1dvAC4Kcwy1m2PPCA_9x1FjTi-";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);