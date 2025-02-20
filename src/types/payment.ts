
import { Json } from "@/types/database/auth";

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'frozen' | 'confirmed' | 'cancelled';
  transaction_type: 'job_posting' | 'subscription' | 'other';
  payment_method: 'credit_card' | 'interac';
  metadata: Json;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PaymentMethod {
  id: string;
  payment_type: 'credit_card' | 'interac';
  is_default: boolean;
  is_active: boolean;
  card_last_four?: string;
  card_brand?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  stripe_payment_method_id?: string;
  last_used_at?: string;
}
