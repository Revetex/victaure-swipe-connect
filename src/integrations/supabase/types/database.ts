export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: Tables;
    Views: {
      [_ in never]: never
    };
    Functions: {
      change_user_password: {
        Args: {
          current_password: string;
          new_password: string;
        };
        Returns: boolean;
      };
      get_secret: {
        Args: {
          secret_name: string;
        };
        Returns: { secret: string };
      };
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}