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
      ai_learning_data: {
        Row: {
          context: Json | null
          created_at: string | null
          feedback_score: number | null
          id: string
          metadata: Json | null
          question: string
          response: string
          tags: string[] | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          feedback_score?: number | null
          id?: string
          metadata?: Json | null
          question: string
          response: string
          tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          feedback_score?: number | null
          id?: string
          metadata?: Json | null
          question?: string
          response?: string
          tags?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_sessions: {
        Row: {
          created_at: string | null
          id: string
          last_seen_at: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_ai: boolean | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      chess_games: {
        Row: {
          ai_difficulty: string | null
          black_player_id: string | null
          created_at: string
          game_state: Json
          id: string
          status: string | null
          updated_at: string
          white_player_id: string
          winner_id: string | null
        }
        Insert: {
          ai_difficulty?: string | null
          black_player_id?: string | null
          created_at?: string
          game_state?: Json
          id?: string
          status?: string | null
          updated_at?: string
          white_player_id: string
          winner_id?: string | null
        }
        Update: {
          ai_difficulty?: string | null
          black_player_id?: string | null
          created_at?: string
          game_state?: Json
          id?: string
          status?: string | null
          updated_at?: string
          white_player_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chess_games_black_player_id_fkey"
            columns: ["black_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chess_games_white_player_id_fkey"
            columns: ["white_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chess_games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_deleted: boolean | null
          last_message: string | null
          last_message_time: string | null
          metadata: Json | null
          participant1_id: string
          participant2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          last_message?: string | null
          last_message_time?: string | null
          metadata?: Json | null
          participant1_id: string
          participant2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          last_message?: string | null
          last_message_time?: string | null
          metadata?: Json | null
          participant1_id?: string
          participant2_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      deleted_conversations: {
        Row: {
          conversation_partner_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          conversation_partner_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          conversation_partner_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deleted_conversations_conversation_partner_id_fkey"
            columns: ["conversation_partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deleted_conversations_user_id_fkey"
            columns: ["user_id"]
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
      friend_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hidden_posts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hidden_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hidden_posts_user_id_fkey"
            columns: ["user_id"]
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
      job_transcriptions: {
        Row: {
          ai_transcription: string | null
          created_at: string
          id: string
          job_id: string | null
          updated_at: string
        }
        Insert: {
          ai_transcription?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_transcription?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_job_transcriptions_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_transcriptions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scraped_jobs"
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
          language_requirements: string | null
          languages: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          mission_type: string
          payment_schedule: string | null
          preferred_skills: string[] | null
          province: string | null
          qualifications: string[] | null
          remote_type: string | null
          required_skills: string[] | null
          responsibilities: string[] | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: string | null
          source: string
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
          language_requirements?: string | null
          languages?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          mission_type?: string
          payment_schedule?: string | null
          preferred_skills?: string[] | null
          province?: string | null
          qualifications?: string[] | null
          remote_type?: string | null
          required_skills?: string[] | null
          responsibilities?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          source?: string
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
          language_requirements?: string | null
          languages?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          mission_type?: string
          payment_schedule?: string | null
          preferred_skills?: string[] | null
          province?: string | null
          qualifications?: string[] | null
          remote_type?: string | null
          required_skills?: string[] | null
          responsibilities?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          source?: string
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
      message_deliveries: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          id: string
          message_id: string
          read_at: string | null
          recipient_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          message_id: string
          read_at?: string | null
          recipient_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          message_id?: string
          read_at?: string | null
          recipient_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_deliveries_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "latest_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_deliveries_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_status: {
        Row: {
          created_at: string
          id: string
          message_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_status_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "latest_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_status_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: Json | null
          edited_at: string | null
          id: string
          is_ai_message: boolean | null
          is_deleted: boolean | null
          message_type: string | null
          metadata: Json | null
          reaction: string | null
          read: boolean | null
          receiver_id: string
          sender_id: string
          status: string | null
          timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: Json | null
          edited_at?: string | null
          id?: string
          is_ai_message?: boolean | null
          is_deleted?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          reaction?: string | null
          read?: boolean | null
          receiver_id: string
          sender_id: string
          status?: string | null
          timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: Json | null
          edited_at?: string | null
          id?: string
          is_ai_message?: boolean | null
          is_deleted?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          reaction?: string | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          status?: string | null
          timestamp?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_receiver"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
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
      navigation_preferences: {
        Row: {
          created_at: string
          custom_labels: Json | null
          hidden_items: Json | null
          id: string
          menu_order: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_labels?: Json | null
          hidden_items?: Json | null
          id: string
          menu_order?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_labels?: Json | null
          hidden_items?: Json | null
          id?: string
          menu_order?: Json | null
          updated_at?: string
        }
        Relationships: []
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
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          read_at: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      obsolete_features: {
        Row: {
          alternatives: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          profile_id: string | null
          reason: string | null
          removal_date: string | null
          updated_at: string | null
        }
        Insert: {
          alternatives?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          profile_id?: string | null
          reason?: string | null
          removal_date?: string | null
          updated_at?: string | null
        }
        Update: {
          alternatives?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          profile_id?: string | null
          reason?: string | null
          removal_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "obsolete_features_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          status?: string | null
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
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          dislikes: number | null
          id: string
          images: string[] | null
          likes: number | null
          privacy_level: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          images?: string[] | null
          likes?: number | null
          privacy_level?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          dislikes?: number | null
          id?: string
          images?: string[] | null
          likes?: number | null
          privacy_level?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_settings: {
        Row: {
          created_at: string
          id: string
          language: string | null
          notifications_enabled: boolean | null
          privacy_enabled: boolean | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auto_update_enabled: boolean | null
          avatar_url: string | null
          bio: string | null
          chess_elo: number | null
          city: string | null
          company_name: string | null
          company_size: string | null
          country: string | null
          created_at: string | null
          custom_background: string | null
          custom_font: string | null
          custom_text_color: string | null
          display_name: string | null
          email: string
          full_name: string | null
          id: string
          industry: string | null
          last_seen: string | null
          last_used_tool: string | null
          latitude: number | null
          location_enabled: boolean | null
          longitude: number | null
          notifications_enabled: boolean | null
          online_status: boolean | null
          phone: string | null
          privacy_enabled: boolean | null
          push_notifications_enabled: boolean | null
          push_token: string | null
          role: string
          search_enabled: boolean | null
          sections_order: string[] | null
          skills: string[] | null
          state: string | null
          style_id: string | null
          tools_order: string[] | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          auto_update_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          chess_elo?: number | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          custom_background?: string | null
          custom_font?: string | null
          custom_text_color?: string | null
          display_name?: string | null
          email: string
          full_name?: string | null
          id: string
          industry?: string | null
          last_seen?: string | null
          last_used_tool?: string | null
          latitude?: number | null
          location_enabled?: boolean | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          online_status?: boolean | null
          phone?: string | null
          privacy_enabled?: boolean | null
          push_notifications_enabled?: boolean | null
          push_token?: string | null
          role: string
          search_enabled?: boolean | null
          sections_order?: string[] | null
          skills?: string[] | null
          state?: string | null
          style_id?: string | null
          tools_order?: string[] | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          auto_update_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          chess_elo?: number | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          custom_background?: string | null
          custom_font?: string | null
          custom_text_color?: string | null
          display_name?: string | null
          email?: string
          full_name?: string | null
          id?: string
          industry?: string | null
          last_seen?: string | null
          last_used_tool?: string | null
          latitude?: number | null
          location_enabled?: boolean | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          online_status?: boolean | null
          phone?: string | null
          privacy_enabled?: boolean | null
          push_notifications_enabled?: boolean | null
          push_token?: string | null
          role?: string
          search_enabled?: boolean | null
          sections_order?: string[] | null
          skills?: string[] | null
          state?: string | null
          style_id?: string | null
          tools_order?: string[] | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      scraped_jobs: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          id: string
          location: string
          posted_at: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          posted_at?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          posted_at?: string | null
          title?: string
          updated_at?: string | null
          url?: string
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
      task_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          scheduled_for: string
          task_id: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          scheduled_for: string
          task_id: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          scheduled_for?: string
          task_id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          all_day: boolean | null
          category: string | null
          completed: boolean | null
          created_at: string | null
          due_date: string | null
          due_time: string | null
          id: string
          priority: string | null
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          priority?: string | null
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          priority?: string | null
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
      translations: {
        Row: {
          created_at: string
          detected_lang: string | null
          id: string
          source_lang: string
          source_text: string
          target_lang: string
          translated_text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          detected_lang?: string | null
          id?: string
          source_lang: string
          source_text: string
          target_lang: string
          translated_text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          detected_lang?: string | null
          id?: string
          source_lang?: string
          source_text?: string
          target_lang?: string
          translated_text?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      latest_messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: Json | null
          edited_at: string | null
          id: string | null
          is_ai_message: boolean | null
          is_deleted: boolean | null
          message_type: string | null
          metadata: Json | null
          reaction: string | null
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_receiver"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
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
    }
    Functions: {
      change_user_password: {
        Args: {
          current_password: string
          new_password: string
        }
        Returns: boolean
      }
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cube:
        | {
            Args: {
              "": number[]
            }
            Returns: unknown
          }
        | {
            Args: {
              "": number
            }
            Returns: unknown
          }
      cube_dim: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      cube_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_is_point: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      cube_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      cube_size: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      earth: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      gc_to_sec: {
        Args: {
          "": number
        }
        Returns: number
      }
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: {
          secret: string
        }[]
      }
      handle_post_reaction: {
        Args: {
          p_post_id: string
          p_user_id: string
          p_reaction_type: string
        }
        Returns: undefined
      }
      latitude: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      longitude: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      mark_conversation_deleted: {
        Args: {
          p_user_id: string
          p_conversation_partner_id: string
        }
        Returns: undefined
      }
      mark_messages_as_read: {
        Args: {
          conversation_partner_id: string
        }
        Returns: undefined
      }
      sec_to_gc: {
        Args: {
          "": number
        }
        Returns: number
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
      message_delivery_status: "pending" | "delivered" | "read"
      mission_type: "company" | "individual"
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
