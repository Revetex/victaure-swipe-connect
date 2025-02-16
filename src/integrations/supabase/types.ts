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
      ai_file_uploads: {
        Row: {
          content_text: string | null
          created_at: string
          file_name: string
          file_path: string
          file_type: string
          id: string
          processed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_text?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_type: string
          id?: string
          processed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_text?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          processed?: boolean | null
          updated_at?: string
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
      ai_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          read: boolean | null
          sender: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read?: boolean | null
          sender?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read?: boolean | null
          sender?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      app_versions: {
        Row: {
          checksum: string | null
          created_at: string | null
          downloads_count: number | null
          file_path: string
          id: string
          is_active: boolean | null
          min_android_version: string | null
          release_notes: string | null
          released_at: string | null
          size_bytes: number | null
          updated_at: string | null
          version: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string | null
          downloads_count?: number | null
          file_path: string
          id?: string
          is_active?: boolean | null
          min_android_version?: string | null
          release_notes?: string | null
          released_at?: string | null
          size_bytes?: number | null
          updated_at?: string | null
          version: string
        }
        Update: {
          checksum?: string | null
          created_at?: string | null
          downloads_count?: number | null
          file_path?: string
          id?: string
          is_active?: boolean | null
          min_android_version?: string | null
          release_notes?: string | null
          released_at?: string | null
          size_bytes?: number | null
          updated_at?: string | null
          version?: string
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
      business_profiles: {
        Row: {
          company_name: string
          company_size: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          subscription_status: string | null
          trial_end_date: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          company_name: string
          company_size?: string | null
          created_at?: string
          description?: string | null
          id: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          company_name?: string
          company_size?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      business_subscriptions: {
        Row: {
          business_id: string
          cancelled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          product_id: string
          status: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          business_id: string
          cancelled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          product_id: string
          status?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          business_id?: string
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          product_id?: string
          status?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "subscription_products"
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
          castling_rights: Json | null
          created_at: string
          draw_reason: string | null
          en_passant_target: Json | null
          full_move_number: number | null
          game_state: Json
          half_move_clock: number | null
          id: string
          is_check: boolean | null
          is_checkmate: boolean | null
          is_draw: boolean | null
          is_stalemate: boolean | null
          status: string
          updated_at: string
          white_player_id: string
          winner_id: string | null
        }
        Insert: {
          ai_difficulty?: string | null
          black_player_id?: string | null
          castling_rights?: Json | null
          created_at?: string
          draw_reason?: string | null
          en_passant_target?: Json | null
          full_move_number?: number | null
          game_state?: Json
          half_move_clock?: number | null
          id?: string
          is_check?: boolean | null
          is_checkmate?: boolean | null
          is_draw?: boolean | null
          is_stalemate?: boolean | null
          status?: string
          updated_at?: string
          white_player_id: string
          winner_id?: string | null
        }
        Update: {
          ai_difficulty?: string | null
          black_player_id?: string | null
          castling_rights?: Json | null
          created_at?: string
          draw_reason?: string | null
          en_passant_target?: Json | null
          full_move_number?: number | null
          game_state?: Json
          half_move_clock?: number | null
          id?: string
          is_check?: boolean | null
          is_checkmate?: boolean | null
          is_draw?: boolean | null
          is_stalemate?: boolean | null
          status?: string
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
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          joined_at: string | null
          left_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          group_avatar: string | null
          group_name: string | null
          id: string
          is_deleted: boolean | null
          is_group: boolean | null
          last_activity: string | null
          last_message: string | null
          last_message_time: string | null
          metadata: Json | null
          participant1_id: string
          participant2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_avatar?: string | null
          group_name?: string | null
          id?: string
          is_deleted?: boolean | null
          is_group?: boolean | null
          last_activity?: string | null
          last_message?: string | null
          last_message_time?: string | null
          metadata?: Json | null
          participant1_id: string
          participant2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_avatar?: string | null
          group_name?: string | null
          id?: string
          is_deleted?: boolean | null
          is_group?: boolean | null
          last_activity?: string | null
          last_message?: string | null
          last_message_time?: string | null
          metadata?: Json | null
          participant1_id?: string
          participant2_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      cover_letters: {
        Row: {
          content: string
          created_at: string
          id: string
          job_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          job_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          job_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cover_letters_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cover_letters_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "relevant_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cover_letters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          template_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          template_data: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_friends_list_components: {
        Row: {
          component_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          component_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          component_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      deleted_ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      deleted_conversations: {
        Row: {
          conversation_partner_id: string
          created_at: string
          id: string
          keep_pinned: boolean | null
          user_id: string
        }
        Insert: {
          conversation_partner_id: string
          created_at?: string
          id?: string
          keep_pinned?: boolean | null
          user_id: string
        }
        Update: {
          conversation_partner_id?: string
          created_at?: string
          id?: string
          keep_pinned?: boolean | null
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
      job_applications: {
        Row: {
          application_date: string
          cover_letter_id: string | null
          created_at: string
          cv_id: string | null
          id: string
          job_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_date?: string
          cover_letter_id?: string | null
          created_at?: string
          cv_id?: string | null
          id?: string
          job_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_date?: string
          cover_letter_id?: string | null
          created_at?: string
          cv_id?: string | null
          id?: string
          job_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_cover_letter_id_fkey"
            columns: ["cover_letter_id"]
            isOneToOne: false
            referencedRelation: "cover_letters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "relevant_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_bids: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string | null
          currency: string
          id: string
          job_id: string
          message: string | null
          payment_status: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string | null
          currency?: string
          id?: string
          job_id: string
          message?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string | null
          currency?: string
          id?: string
          job_id?: string
          message?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_bids_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_bids_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "relevant_jobs"
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
      job_postings: {
        Row: {
          business_id: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          is_priority: boolean | null
          job_type: string | null
          location: string | null
          priority_expires_at: string | null
          published_at: string | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          title: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          is_priority?: boolean | null
          job_type?: string | null
          location?: string | null
          priority_expires_at?: string | null
          published_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_priority?: boolean | null
          job_type?: string | null
          location?: string | null
          priority_expires_at?: string | null
          published_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "fk_job_transcriptions_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "relevant_jobs"
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
      job_views: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          accept_bids: boolean | null
          application_deadline: string | null
          application_steps: Json | null
          benefits: string[] | null
          bid_end_date: string | null
          budget: number
          category: string
          certifications_required: string[] | null
          company_culture: string[] | null
          company_description: string | null
          company_logo: string | null
          company_name: string | null
          company_size: string | null
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
          interview_process: Json | null
          is_urgent: boolean | null
          key_responsibilities: string[] | null
          language_requirements: string | null
          languages: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          max_bid: number | null
          min_bid: number | null
          mission_type: string
          payment_schedule: string | null
          perks: string[] | null
          preferred_skills: string[] | null
          province: string | null
          qualifications: string[] | null
          remote_type: string | null
          required_certifications: string[] | null
          required_skills: string[] | null
          responsibilities: string[] | null
          salary_benefits: Json | null
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
          workplace_type: string | null
          years_of_experience: number | null
        }
        Insert: {
          accept_bids?: boolean | null
          application_deadline?: string | null
          application_steps?: Json | null
          benefits?: string[] | null
          bid_end_date?: string | null
          budget: number
          category?: string
          certifications_required?: string[] | null
          company_culture?: string[] | null
          company_description?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_size?: string | null
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
          interview_process?: Json | null
          is_urgent?: boolean | null
          key_responsibilities?: string[] | null
          language_requirements?: string | null
          languages?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_bid?: number | null
          min_bid?: number | null
          mission_type?: string
          payment_schedule?: string | null
          perks?: string[] | null
          preferred_skills?: string[] | null
          province?: string | null
          qualifications?: string[] | null
          remote_type?: string | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          responsibilities?: string[] | null
          salary_benefits?: Json | null
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
          workplace_type?: string | null
          years_of_experience?: number | null
        }
        Update: {
          accept_bids?: boolean | null
          application_deadline?: string | null
          application_steps?: Json | null
          benefits?: string[] | null
          bid_end_date?: string | null
          budget?: number
          category?: string
          certifications_required?: string[] | null
          company_culture?: string[] | null
          company_description?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_size?: string | null
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
          interview_process?: Json | null
          is_urgent?: boolean | null
          key_responsibilities?: string[] | null
          language_requirements?: string | null
          languages?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_bid?: number | null
          min_bid?: number | null
          mission_type?: string
          payment_schedule?: string | null
          perks?: string[] | null
          preferred_skills?: string[] | null
          province?: string | null
          qualifications?: string[] | null
          remote_type?: string | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          responsibilities?: string[] | null
          salary_benefits?: Json | null
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
          workplace_type?: string | null
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
      marketplace_bids: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string
          id: string
          service_id: string
          status: string | null
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string
          id?: string
          service_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string
          id?: string
          service_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_bids_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "marketplace_services"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          category_id: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          favorites_count: number | null
          id: string
          images: string[] | null
          location: Json | null
          metadata: Json | null
          price: number
          searchable_text: unknown | null
          seller_id: string
          status: string
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          favorites_count?: number | null
          id?: string
          images?: string[] | null
          location?: Json | null
          metadata?: Json | null
          price: number
          searchable_text?: unknown | null
          seller_id: string
          status?: string
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          favorites_count?: number | null
          id?: string
          images?: string[] | null
          location?: Json | null
          metadata?: Json | null
          price?: number
          searchable_text?: unknown | null
          seller_id?: string
          status?: string
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_job_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_job_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "marketplace_job_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_jobs: {
        Row: {
          category_id: string | null
          company_logo: string | null
          company_name: string | null
          contract_type: string
          created_at: string
          description: string | null
          employer_id: string
          experience_level: string
          id: string
          location: string
          remote_type: string
          salary_currency: string
          salary_max: number | null
          salary_min: number | null
          salary_period: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          company_logo?: string | null
          company_name?: string | null
          contract_type: string
          created_at?: string
          description?: string | null
          employer_id: string
          experience_level: string
          id?: string
          location: string
          remote_type: string
          salary_currency?: string
          salary_max?: number | null
          salary_min?: number | null
          salary_period: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          company_logo?: string | null
          company_name?: string | null
          contract_type?: string
          created_at?: string
          description?: string | null
          employer_id?: string
          experience_level?: string
          id?: string
          location?: string
          remote_type?: string
          salary_currency?: string
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_job_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_jobs_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_services: {
        Row: {
          auction_end_date: string | null
          category_id: string | null
          created_at: string | null
          current_price: number | null
          description: string | null
          id: string
          images: string[] | null
          price: number | null
          provider_id: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          auction_end_date?: string | null
          category_id?: string | null
          created_at?: string | null
          current_price?: number | null
          description?: string | null
          id?: string
          images?: string[] | null
          price?: number | null
          provider_id: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          auction_end_date?: string | null
          category_id?: string | null
          created_at?: string | null
          current_price?: number | null
          description?: string | null
          id?: string
          images?: string[] | null
          price?: number | null
          provider_id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_services_provider_id_fkey"
            columns: ["provider_id"]
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
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "relevant_jobs"
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
          encrypted: boolean | null
          encryption_key: string | null
          id: string
          is_assistant: boolean | null
          is_deleted: boolean | null
          is_system_sender: boolean | null
          message_hash: string | null
          message_state: string | null
          message_type: string | null
          metadata: Json | null
          page_cursor: string | null
          reaction: string | null
          read: boolean | null
          receiver_id: string
          sender_id: string | null
          status: string | null
          system_message: boolean | null
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
          encrypted?: boolean | null
          encryption_key?: string | null
          id?: string
          is_assistant?: boolean | null
          is_deleted?: boolean | null
          is_system_sender?: boolean | null
          message_hash?: string | null
          message_state?: string | null
          message_type?: string | null
          metadata?: Json | null
          page_cursor?: string | null
          reaction?: string | null
          read?: boolean | null
          receiver_id: string
          sender_id?: string | null
          status?: string | null
          system_message?: boolean | null
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
          encrypted?: boolean | null
          encryption_key?: string | null
          id?: string
          is_assistant?: boolean | null
          is_deleted?: boolean | null
          is_system_sender?: boolean | null
          message_hash?: string | null
          message_state?: string | null
          message_type?: string | null
          metadata?: Json | null
          page_cursor?: string | null
          reaction?: string | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string | null
          status?: string | null
          system_message?: boolean | null
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
          layout_type: string | null
          metadata: Json | null
          pinned: boolean | null
          position: Json | null
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
          layout_type?: string | null
          metadata?: Json | null
          pinned?: boolean | null
          position?: Json | null
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
          layout_type?: string | null
          metadata?: Json | null
          pinned?: boolean | null
          position?: Json | null
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
      payment_escrows: {
        Row: {
          amount: number
          bid_id: string | null
          contract_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          payee_id: string
          payer_id: string
          release_conditions: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          bid_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payee_id: string
          payer_id: string
          release_conditions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bid_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payee_id?: string
          payer_id?: string
          release_conditions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_escrows_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "job_bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_escrows_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "service_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_escrows_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_escrows_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_intents: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          status: string
          stripe_payment_intent_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          stripe_payment_intent_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          stripe_payment_intent_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_last_four: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_used_at: string | null
          payment_type: string
          stripe_payment_method_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          payment_type: string
          stripe_payment_method_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          payment_type?: string
          stripe_payment_method_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_method: string
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method: string
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string
          status?: string
          transaction_type?: string
          updated_at?: string
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
      paypal_transactions: {
        Row: {
          amount: number
          bid_id: string | null
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          paypal_transaction_id: string | null
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bid_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          paypal_transaction_id?: string | null
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bid_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          paypal_transaction_id?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paypal_transactions_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "job_bids"
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
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string
          updated_at?: string | null
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
          account_locked: boolean | null
          auto_update_enabled: boolean | null
          availability_date: string | null
          avatar_url: string | null
          bio: string | null
          career_objectives: string | null
          certificates: string[] | null
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
          failed_attempts: number | null
          full_name: string | null
          id: string
          industry: string | null
          languages: string[] | null
          last_activity: string | null
          last_failed_attempt: string | null
          last_seen: string | null
          last_used_tool: string | null
          latitude: number | null
          location_enabled: boolean | null
          longitude: number | null
          notifications_enabled: boolean | null
          online_status: boolean | null
          phone: string | null
          preferred_locations: string[] | null
          preferred_work_type: string[] | null
          privacy_enabled: boolean | null
          push_notifications_enabled: boolean | null
          push_token: string | null
          role: string
          salary_expectations: Json | null
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
          account_locked?: boolean | null
          auto_update_enabled?: boolean | null
          availability_date?: string | null
          avatar_url?: string | null
          bio?: string | null
          career_objectives?: string | null
          certificates?: string[] | null
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
          failed_attempts?: number | null
          full_name?: string | null
          id: string
          industry?: string | null
          languages?: string[] | null
          last_activity?: string | null
          last_failed_attempt?: string | null
          last_seen?: string | null
          last_used_tool?: string | null
          latitude?: number | null
          location_enabled?: boolean | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          online_status?: boolean | null
          phone?: string | null
          preferred_locations?: string[] | null
          preferred_work_type?: string[] | null
          privacy_enabled?: boolean | null
          push_notifications_enabled?: boolean | null
          push_token?: string | null
          role: string
          salary_expectations?: Json | null
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
          account_locked?: boolean | null
          auto_update_enabled?: boolean | null
          availability_date?: string | null
          avatar_url?: string | null
          bio?: string | null
          career_objectives?: string | null
          certificates?: string[] | null
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
          failed_attempts?: number | null
          full_name?: string | null
          id?: string
          industry?: string | null
          languages?: string[] | null
          last_activity?: string | null
          last_failed_attempt?: string | null
          last_seen?: string | null
          last_used_tool?: string | null
          latitude?: number | null
          location_enabled?: boolean | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          online_status?: boolean | null
          phone?: string | null
          preferred_locations?: string[] | null
          preferred_work_type?: string[] | null
          privacy_enabled?: boolean | null
          push_notifications_enabled?: boolean | null
          push_token?: string | null
          role?: string
          salary_expectations?: Json | null
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
      push_notifications: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          id: string
          read_at: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          id?: string
          read_at?: string | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          read_at?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scraped_jobs: {
        Row: {
          benefits: string[] | null
          company: string
          created_at: string | null
          description: string | null
          experience_level: string | null
          id: string
          industry: string | null
          job_type: string | null
          location: string
          match_score: number | null
          posted_at: string | null
          relevance_score: number | null
          remote_type: string | null
          requirements: string[] | null
          salary_range: string | null
          skills: string[] | null
          source_platform: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          benefits?: string[] | null
          company: string
          created_at?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          job_type?: string | null
          location: string
          match_score?: number | null
          posted_at?: string | null
          relevance_score?: number | null
          remote_type?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          skills?: string[] | null
          source_platform?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          benefits?: string[] | null
          company?: string
          created_at?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          job_type?: string | null
          location?: string
          match_score?: number | null
          posted_at?: string | null
          relevance_score?: number | null
          remote_type?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          skills?: string[] | null
          source_platform?: string | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      search_parameters: {
        Row: {
          created_at: string | null
          custom_parameters: Json | null
          google_cse_id: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_parameters?: Json | null
          google_cse_id?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_parameters?: Json | null
          google_cse_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_bids: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string | null
          id: string
          service_id: string
          status: string
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string | null
          id?: string
          service_id: string
          status?: string
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string | null
          id?: string
          service_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bids_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "marketplace_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_contracts: {
        Row: {
          client_id: string | null
          contract_type: string
          contractor_id: string
          created_at: string | null
          currency: string | null
          description: string | null
          end_date: string | null
          fixed_price: number | null
          id: string
          max_bid: number | null
          min_bid: number | null
          payment_status: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          contract_type: string
          contractor_id: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string | null
          fixed_price?: number | null
          id?: string
          max_bid?: number | null
          min_bid?: number | null
          payment_status?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          contract_type?: string
          contractor_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string | null
          fixed_price?: number | null
          id?: string
          max_bid?: number | null
          min_bid?: number | null
          payment_status?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_contracts_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          display_preferences: Json | null
          id: string
          language: string | null
          notification_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_preferences?: Json | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_preferences?: Json | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
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
      stripe_customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_products: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          features: Json | null
          id: string
          interval: string | null
          name: string
          price: number
          type: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string | null
          name: string
          price: number
          type?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string | null
          name?: string
          price?: number
          type?: string | null
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
      tasks: {
        Row: {
          all_day: boolean | null
          completed: boolean | null
          created_at: string | null
          due_date: string | null
          due_time: string | null
          id: string
          text: string
          updated_at: string | null
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      theme_settings: {
        Row: {
          created_at: string | null
          custom_colors: Json | null
          id: string
          mode: Database["public"]["Enums"]["theme_mode"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_colors?: Json | null
          id?: string
          mode?: Database["public"]["Enums"]["theme_mode"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_colors?: Json | null
          id?: string
          mode?: Database["public"]["Enums"]["theme_mode"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      tools: {
        Row: {
          created_at: string | null
          description: string | null
          enabled: boolean | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      user_conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message: string | null
          last_message_time: string | null
          participant1_id: string
          participant1_last_read: string | null
          participant2_id: string
          participant2_last_read: string | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          participant1_id: string
          participant1_last_read?: string | null
          participant2_id: string
          participant2_last_read?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          participant1_id?: string
          participant1_last_read?: string | null
          participant2_id?: string
          participant2_last_read?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_conversations_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_conversations_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cvs: {
        Row: {
          created_at: string
          cv_data: Json
          id: string
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cv_data: Json
          id?: string
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cv_data?: Json
          id?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cvs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cv_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cvs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_job_preferences: {
        Row: {
          created_at: string | null
          default_view: string | null
          filters: Json | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_view?: string | null
          filters?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_view?: string | null
          filters?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_job_preferences_default_view_fkey"
            columns: ["default_view"]
            isOneToOne: false
            referencedRelation: "job_views"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_job_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tools: {
        Row: {
          created_at: string | null
          custom_settings: Json | null
          enabled: boolean | null
          id: string
          order_index: number | null
          tool_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_settings?: Json | null
          enabled?: boolean | null
          id?: string
          order_index?: number | null
          tool_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_settings?: Json | null
          enabled?: boolean | null
          id?: string
          order_index?: number | null
          tool_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      relevant_jobs: {
        Row: {
          budget: number | null
          category: string | null
          contract_type: string | null
          created_at: string | null
          description: string | null
          employer_avatar_url: string | null
          employer_company_name: string | null
          employer_id: string | null
          experience_level: string | null
          id: string | null
          is_owner: boolean | null
          location: string | null
          mission_type: string | null
          status: string | null
          title: string | null
          updated_at: string | null
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
      delete_ai_conversation: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
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
      increment_app_download_count: {
        Args: {
          version_id: string
        }
        Returns: undefined
      }
      mark_conversation_deleted:
        | {
            Args: {
              p_user_id: string
              p_conversation_partner_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_user_id: string
              p_conversation_partner_id: string
              p_keep_pinned?: boolean
            }
            Returns: undefined
          }
      mark_messages_as_read: {
        Args: {
          conversation_partner_id: string
        }
        Returns: undefined
      }
      mark_user_messages_as_read: {
        Args: {
          conversation_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      chess_game_status: "in_progress" | "completed" | "abandoned"
      conversation_status: "active" | "archived" | "blocked"
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
      message_sender_type: "user" | "assistant" | "system"
      mission_type: "company" | "individual"
      theme_mode: "light" | "dark" | "system"
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
