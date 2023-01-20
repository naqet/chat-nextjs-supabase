import { Database } from "@/types/supabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function useTypedSbClient() {
  const supabaseClient = useSupabaseClient<Database>();

  return supabaseClient;
}
