
export interface PaymentProps {
  onPaymentRequested: (amount: number, gameTitle: string) => Promise<void>;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: 'card' | 'interac';
  card_brand?: string;
  card_last_four?: string;
  email?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'frozen';
  payment_method: 'card' | 'interac';
  created_at: string;
  description?: string;
}
