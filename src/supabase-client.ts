import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxvokrvtdscblgvoqzgo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dm9rcnZ0ZHNjYmxndm9xemdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTIxMTUsImV4cCI6MjA3MjcyODExNX0.NTSY-7D1U-hBQ22e6ojkdH3HuZT-lFIZ2jSAttqOOb0")