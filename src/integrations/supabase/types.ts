export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      certifications: {
        Row: {
          created_at: string | null
          credential_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          profile_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          profile_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          profile_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          position: string
          profile_id: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          position: string
          profile_id: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          position?: string
          profile_id?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget: number
          category: string
          contract_type: string
          created_at: string | null
          description: string
          employer_id: string
          experience_level: string
          id: string
          location: string
          status: string
          subcategory: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget: number
          category?: string
          contract_type?: string
          created_at?: string | null
          description: string
          employer_id: string
          experience_level?: string
          id?: string
          location: string
          status?: string
          subcategory?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget?: number
          category?: string
          contract_type?: string
          created_at?: string | null
          description?: string
          employer_id?: string
          experience_level?: string
          id?: string
          location?: string
          status?: string
          subcategory?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          employer_id: string | null
          id: string
          job_id: string
          match_score: number | null
          professional_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employer_id?: string | null
          id?: string
          job_id: string
          match_score?: number | null
          professional_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employer_id?: string | null
          id?: string
          job_id?: string
          match_score?: number | null
          professional_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          color: string
          created_at: string | null
          id: string
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          match_id: string | null
          status: string | null
          stripe_payment_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          match_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          match_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_seen: string | null
          latitude: number | null
          longitude: number | null
          online_status: boolean | null
          phone: string | null
          role: string
          skills: string[] | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_seen?: string | null
          latitude?: number | null
          longitude?: number | null
          online_status?: boolean | null
          phone?: string | null
          role: string
          skills?: string[] | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_seen?: string | null
          latitude?: number | null
          longitude?: number | null
          online_status?: boolean | null
          phone?: string | null
          role?: string
          skills?: string[] | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      todos: {
        Row: {
          all_day: boolean | null
          completed: boolean | null
          created_at: string | null
          due_date: string | null
          due_time: string | null
          id: string
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      change_user_password: {
        Args: {
          current_password: string
          new_password: string
        }
        Returns: boolean
      }
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: {
          secret: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
