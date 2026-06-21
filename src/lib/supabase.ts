import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uvtpssjjbntdrlrzjehh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dHBzc2pqYm50ZHJscnpqZWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDkyNjIsImV4cCI6MjA5NjY4NTI2Mn0.sRyvgRrIvqABA_Gsj0iC6QMU4MBLGZHovEST6ivdUxQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})