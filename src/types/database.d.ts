export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          bio: string | null
          phone: string | null
          city: string | null
          state: string | null
          country: string
          skills: string[] | null
          latitude: number | null
          longitude: number | null
          created_at: string | null
          updated_at: string | null
          company_name: string | null
          company_size: string | null
          industry: string | null
          website: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role: string
          bio?: string | null
          phone?: string | null
          city?: string | null
          state?: string | null
          country?: string
          skills?: string[] | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | null
          updated_at?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          bio?: string | null
          phone?: string | null
          city?: string | null
          state?: string | null
          country?: string
          skills?: string[] | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | null
          updated_at?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          website?: string | null
        }
      }
    }
  }
}