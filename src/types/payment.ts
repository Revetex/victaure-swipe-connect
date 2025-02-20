
export interface PaymentProps {
  onPaymentRequested: (amount: number, gameTitle: string) => Promise<void>;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: 'credit_card' | 'interac';  // Changé de 'card' à 'credit_card'
  card_brand?: string;
  card_last_four?: string;
  email?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stripe_payment_method_id?: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'frozen';
  payment_method: 'credit_card' | 'interac';  // Mis à jour ici aussi
  created_at: string;
  description?: string;
}
