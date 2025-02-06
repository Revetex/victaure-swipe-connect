
import { Json } from './auth';

export interface MessageTypes {
  Tables: {
    messages: {
      Row: {
        id: string;
        sender_id: string;
        receiver_id: string;
        content: string;
        read: boolean | null;
        created_at: string | null;
        updated_at: string | null;
        is_ai_message: boolean | null;
      };
      Insert: {
        id: string;
        sender_id: string;
        receiver_id: string;
        content: string;
        read?: boolean | null;
        created_at?: string | null;
        updated_at?: string | null;
        is_ai_message?: boolean | null;
      };
      Update: {
        id?: string;
        sender_id?: string;
        receiver_id?: string;
        content?: string;
        read?: boolean | null;
        created_at?: string | null;
        updated_at?: string | null;
        is_ai_message?: boolean | null;
      };
    };
  };
}
