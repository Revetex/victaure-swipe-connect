
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
        message_type: 'user' | 'ai' | 'system';
        status: 'sent' | 'delivered' | 'read';
        metadata: Json | null;
        reaction: string | null;
      };
      Insert: {
        id: string;
        sender_id: string;
        receiver_id: string;
        content: string;
        read?: boolean | null;
        created_at?: string | null;
        updated_at?: string | null;
        message_type?: 'user' | 'ai' | 'system';
        status?: 'sent' | 'delivered' | 'read';
        metadata?: Json | null;
        reaction?: string | null;
      };
      Update: {
        id?: string;
        sender_id?: string;
        receiver_id?: string;
        content?: string;
        read?: boolean | null;
        created_at?: string | null;
        updated_at?: string | null;
        message_type?: 'user' | 'ai' | 'system';
        status?: 'sent' | 'delivered' | 'read';
        metadata?: Json | null;
        reaction?: string | null;
      };
    };
    message_deliveries: {
      Row: {
        id: string;
        message_id: string;
        recipient_id: string;
        status: 'pending' | 'delivered' | 'read';
        delivered_at: string | null;
        read_at: string | null;
        created_at: string | null;
      };
      Insert: {
        id?: string;
        message_id: string;
        recipient_id: string;
        status?: 'pending' | 'delivered' | 'read';
        delivered_at?: string | null;
        read_at?: string | null;
        created_at?: string | null;
      };
      Update: {
        id?: string;
        message_id?: string;
        recipient_id?: string;
        status?: 'pending' | 'delivered' | 'read';
        delivered_at?: string | null;
        read_at?: string | null;
        created_at?: string | null;
      };
    };
  };
}
