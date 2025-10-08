import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create optimized Supabase client with performance settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence for better performance
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-client-info': 'personal-portfolio',
    },
  },
})

// Database types
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          github: string
          demo: string | null
          description: string
          stack: string[]
          screenshots: string[]
          created_at: string
          updated_at: string
          order_index: number
        }
        Insert: {
          id?: string
          slug: string
          title: string
          github: string
          demo?: string | null
          description: string
          stack: string[]
          screenshots: string[]
          created_at?: string
          updated_at?: string
          order_index?: number
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          github?: string
          demo?: string | null
          description?: string
          stack?: string[]
          screenshots?: string[]
          created_at?: string
          updated_at?: string
          order_index?: number
        }
      }
    }
  }
}

export type ProjectRow = Database['public']['Tables']['projects']['Row']

