
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
        payment_status: 'unpaid' | 'paid' | 'frozen' | 'released' | 'refunded' | 'disputed';
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
        payment_status?: 'unpaid' | 'paid' | 'frozen' | 'released' | 'refunded' | 'disputed';
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
        payment_status?: 'unpaid' | 'paid' | 'frozen' | 'released' | 'refunded' | 'disputed';
        message?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
      };
    };
    marketplace_services: {
      Row: {
        id: string;
        title: string;
        description: string | null;
        provider_id: string;
        status: 'active' | 'closed' | 'pending' | 'cancelled';
        price: number | null;
        currency: string;
        created_at: string;
        updated_at: string;
        category_id: string | null;
        images: string[] | null;
        type: 'fixed' | 'auction';
        auction_end_date: string | null;
        current_price: number | null;
      };
      Insert: {
        title: string;
        description?: string | null;
        provider_id: string;
        status?: 'active' | 'closed' | 'pending' | 'cancelled';
        price?: number | null;
        currency?: string;
        category_id?: string | null;
        images?: string[] | null;
        type: 'fixed' | 'auction';
        auction_end_date?: string | null;
        current_price?: number | null;
      };
    };
    marketplace_items: {
      Row: {
        id: string;
        title: string;
        description: string | null;
        seller_id: string;
        price: number;
        status: 'active' | 'sold' | 'cancelled';
        created_at: string;
        updated_at: string;
        category_id: string | null;
        images: string[] | null;
        condition: string | null;
        location: Json | null;
        views_count: number | null;
        favorites_count: number | null;
        metadata: Json | null;
      };
      Insert: {
        title: string;
        description?: string | null;
        seller_id: string;
        price: number;
        status?: 'active' | 'sold' | 'cancelled';
        category_id?: string | null;
        images?: string[] | null;
        condition?: string | null;
        location?: Json | null;
        metadata?: Json | null;
      };
    };
  };
}
