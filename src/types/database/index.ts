import type { ScrapedJobsTable } from './tables/scraped-jobs';

export interface Database {
  public: {
    Tables: {
      scraped_jobs: ScrapedJobsTable
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id: string
          sender: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string | null
          credential_url: string | null
          description: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          profile_id: string
          skills: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          profile_id: string
          skills?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          profile_id?: string
          skills?: string[] | null
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
      education: {
        Row: {
          created_at: string | null
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          profile_id: string | null
          school_name: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          profile_id?: string | null
          school_name: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          profile_id?: string | null
          school_name?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
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
      job_categories: {
        Row: {
          created_at: string | null
          id: string
          mission_type: Database["public"]["Enums"]["mission_type"]
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mission_type: Database["public"]["Enums"]["mission_type"]
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mission_type?: Database["public"]["Enums"]["mission_type"]
          name?: string
        }
        Relationships: []
      }
      job_subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          budget: number
          category: string
          certifications_required: string[] | null
          company_description: string | null
          company_logo: string | null
          company_name: string | null
          company_website: string | null
          contract_type: string
          created_at: string | null
          department: string | null
          description: string
          education_level: string | null
          employer_id: string
          experience_level: string
          id: string
          images: string[] | null
          industry: string | null
          is_urgent: boolean | null
          job_type: string | null
          languages: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          mission_type: string
          payment_schedule: string | null
          preferred_skills: string[] | null
          qualifications: string[] | null
          remote_type: string | null
          required_skills: string[] | null
          responsibilities: string[] | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: string | null
          status: string
          subcategory: string | null
          title: string
          tools_and_technologies: string[] | null
          updated_at: string | null
          work_schedule: string[] | null
          years_of_experience: number | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          budget: number
          category?: string
          certifications_required?: string[] | null
          company_description?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_website?: string | null
          contract_type?: string
          created_at?: string | null
          department?: string | null
          description: string
          education_level?: string | null
          employer_id: string
          experience_level?: string
          id?: string
          images?: string[] | null
          industry?: string | null
          is_urgent?: boolean | null
          job_type?: string | null
          languages?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          mission_type?: string
          payment_schedule?: string | null
          preferred_skills?: string[] | null
          qualifications?: string[] | null
          remote_type?: string | null
          required_skills?: string[] | null
          responsibilities?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          status?: string
          subcategory?: string | null
          title: string
          tools_and_technologies?: string[] | null
          updated_at?: string | null
          work_schedule?: string[] | null
          years_of_experience?: number | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          budget?: number
          category?: string
          certifications_required?: string[] | null
          company_description?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_website?: string | null
          contract_type?: string
          created_at?: string | null
          department?: string | null
          description?: string
          education_level?: string | null
          employer_id?: string
          experience_level?: string
          id?: string
          images?: string[] | null
          industry?: string | null
          is_urgent?: boolean | null
          job_type?: string | null
          languages?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          mission_type?: string
          payment_schedule?: string | null
          preferred_skills?: string[] | null
          qualifications?: string[] | null
          remote_type?: string | null
          required_skills?: string[] | null
          responsibilities?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          status?: string
          subcategory?: string | null
          title?: string
          tools_and_technologies?: string[] | null
          updated_at?: string | null
          work_schedule?: string[] | null
          years_of_experience?: number | null
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
          category: string | null
          color: string
          created_at: string | null
          id: string
          pinned: boolean | null
          priority: string | null
          text: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          color?: string
          created_at?: string | null
          id?: string
          pinned?: boolean | null
          priority?: string | null
          text: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          color?: string
          created_at?: string | null
          id?: string
          pinned?: boolean | null
          priority?: string | null
          text?: string
          title?: string | null
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
          payment_type: string | null
          status: string | null
          stripe_payment_id: string | null
          transaction_status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          match_id?: string | null
          payment_type?: string | null
          status?: string
          stripe_payment_id?: string | null
          transaction_status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          match_id?: string | null
          payment_type?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          transaction_status?: string | null
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
          company_name: string | null
          company_size: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          industry: string | null
          last_seen: string | null
          latitude: number | null
          longitude: number | null
          online_status: boolean | null
          phone: string | null
          role: string
          skills: string[] | null
          state: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          industry?: string | null
          last_seen?: string | null
          latitude?: number | null
          longitude?: number | null
          online_status?: boolean | null
          phone?: string | null
          role: string
          skills?: string[] | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          industry?: string | null
          last_seen?: string | null
          latitude?: number | null
          longitude?: number | null
          online_status?: boolean | null
          phone?: string | null
          role?: string
          skills?: string[] | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      change_user_password: {
        Args: { current_password: string; new_password: string }
        Returns: boolean
      }
      get_secret: {
        Args: { secret_name: string }
        Returns: { secret: string }[]
      }
    }
    Enums: {
      job_category:
        | "technology"
        | "design"
        | "writing"
        | "translation"
        | "marketing"
        | "business"
        | "legal"
        | "admin"
        | "customer_service"
        | "other"
      job_source: "linkedin" | "indeed" | "direct"
      mission_type: "company" | "individual"
    }
    CompositeTypes: Record<string, never>
  }
}

export type * from './tables/scraped-jobs';
