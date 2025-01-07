import { Json } from './auth';

export interface PaymentTypes {
  Tables: {
    payments: {
      Row: {
        id: string;
        match_id: string | null;
        amount: number;
        status: string | null;
        stripe_payment_id: string | null;
        created_at: string | null;
        updated_at: string | null;
        payment_type: string | null;
        transaction_status: string | null;
      };
      Insert: {
        match_id?: string | null;
        amount: number;
        status?: string | null;
        stripe_payment_id?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
        payment_type?: string | null;
        transaction_status?: string | null;
      };
      Update: {
        id: string;
        match_id?: string | null;
        amount?: number;
        status?: string | null;
        stripe_payment_id?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
        payment_type?: string | null;
        transaction_status?: string | null;
      };
    };
  };
}
