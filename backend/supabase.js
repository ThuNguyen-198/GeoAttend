import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bclkhutithiyadjxpaut.supabase.co/";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbGtodXRpdGhpeWFkanhwYXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MDM3MzAsImV4cCI6MjA0Mjk3OTczMH0.A0dXbMbUbh46tpCW7DOSaUQr_uf4oMrApvaq26Krp8k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
