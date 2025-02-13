
import { Json } from './auth';

export interface PaymentTypes {
  Tables: {
    job_bids: {
      Row: {
        id: string;
        job_id: string;
        bidder_id: string;
        amount: number;
        currency: string;
        status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
        message: string | null;
        created_at: string | null;
        updated_at: string | null;
      };
      Insert: {
        job_id: string;
        bidder_id: string;
        amount: number;
        currency?: string;
        status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
        message?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
      };
      Update: {
        job_id?: string;
        bidder_id?: string;
        amount?: number;
        currency?: string;
        status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
        message?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
      };
    };
    paypal_transactions: {
      Row: {
        id: string;
        bid_id: string | null;
        sender_id: string;
        receiver_id: string;
        amount: number;
        currency: string;
        paypal_transaction_id: string | null;
        status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
        metadata: Json;
        created_at: string | null;
        updated_at: string | null;
      };
      Insert: {
        bid_id?: string | null;
        sender_id: string;
        receiver_id: string;
        amount: number;
        currency?: string;
        paypal_transaction_id?: string | null;
        status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
        metadata?: Json;
        created_at?: string | null;
        updated_at?: string | null;
      };
      Update: {
        bid_id?: string | null;
        sender_id?: string;
        receiver_id?: string;
        amount?: number;
        currency?: string;
        paypal_transaction_id?: string | null;
        status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
        metadata?: Json;
        created_at?: string | null;
        updated_at?: string | null;
      };
    };
  };
}
