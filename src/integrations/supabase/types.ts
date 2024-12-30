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
      ai_chat_messages: {
        Row: {
          id: string
          user_id: string
          content: string
          sender: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          sender: string
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          sender?: string
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
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
          created_at: string | null
          updated_at: string | null
          latitude: number | null
          longitude: number | null
          online_status: boolean | null
          last_seen: string | null
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
          created_at?: string | null
          updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          online_status?: boolean | null
          last_seen?: string | null
        }
        Update: {
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
          created_at?: string | null
          updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          online_status?: boolean | null
          last_seen?: string | null
        }
      }
      certifications: {
        Row: {
          id: string
          profile_id: string
          title: string
          issuer: string
          issue_date: string | null
          expiry_date: string | null
          credential_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          profile_id: string
          title: string
          issuer: string
          issue_date?: string | null
          expiry_date?: string | null
          credential_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          profile_id?: string
          title?: string
          issuer?: string
          issue_date?: string | null
          expiry_date?: string | null
          credential_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      experiences: {
        Row: {
          id: string
          profile_id: string
          company: string
          position: string
          start_date: string | null
          end_date: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          profile_id: string
          company: string
          position: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          profile_id?: string
          company?: string
          position?: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}