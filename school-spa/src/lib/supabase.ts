import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Student {
  id: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface ClassStudent {
  id: string
  class_id: string
  student_id: string
  created_at: string
}
