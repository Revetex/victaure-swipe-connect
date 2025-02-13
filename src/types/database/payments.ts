
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
    service_contracts: {
      Row: {
        id: string;
        title: string;
        description: string | null;
        contractor_id: string;
        client_id: string | null;
        contract_type: 'fixed_price' | 'auction' | 'hourly';
        status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
        fixed_price: number | null;
        min_bid: number | null;
        max_bid: number | null;
        currency: string;
        payment_status: 'unpaid' | 'paid' | 'frozen' | 'released' | 'refunded' | 'disputed';
        start_date: string | null;
        end_date: string | null;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        title: string;
        description?: string | null;
        contractor_id: string;
        client_id?: string | null;
        contract_type: 'fixed_price' | 'auction' | 'hourly';
        status?: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
        fixed_price?: number | null;
        min_bid?: number | null;
        max_bid?: number | null;
        currency?: string;
        payment_status?: 'unpaid' | 'paid' | 'frozen' | 'released' | 'refunded' | 'disputed';
        start_date?: string | null;
        end_date?: string | null;
      };
      Update: {
        title?: string;
        description?: string | null;
        contractor_id?: string;
        client_id?: string | null;
        contract_type?: 'fixed_price' | 'auction' | 'hourly';
        status?: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
        fixed_price?: number | null;
        min_bid?: number | null;
        max_bid?: number | null;
        currency?: string;
        payment_status?: 'unpaid' | 'paid' | 'frozen' | 'released' | 'refunded' | 'disputed';
        start_date?: string | null;
        end_date?: string | null;
      };
    };
    service_bids: {
      Row: {
        id: string;
        service_id: string;
        bidder_id: string;
        amount: number;
        currency: string;
        status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
        message: string | null;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        service_id: string;
        bidder_id: string;
        amount: number;
        currency?: string;
        status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
        message?: string | null;
      };
      Update: {
        service_id?: string;
        bidder_id?: string;
        amount?: number;
        currency?: string;
        status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
        message?: string | null;
      };
    };
    payment_escrows: {
      Row: {
        id: string;
        contract_id: string | null;
        bid_id: string | null;
        amount: number;
        currency: string;
        status: 'frozen' | 'released' | 'refunded' | 'disputed';
        payer_id: string;
        payee_id: string;
        release_conditions: Json;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        contract_id?: string | null;
        bid_id?: string | null;
        amount: number;
        currency?: string;
        status?: 'frozen' | 'released' | 'refunded' | 'disputed';
        payer_id: string;
        payee_id: string;
        release_conditions?: Json;
      };
      Update: {
        contract_id?: string | null;
        bid_id?: string | null;
        amount?: number;
        currency?: string;
        status?: 'frozen' | 'released' | 'refunded' | 'disputed';
        payer_id?: string;
        payee_id?: string;
        release_conditions?: Json;
      };
    };
  };
}
