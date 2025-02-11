
export interface PaymentMethod {
  id: string;
  payment_type: 'credit_card' | 'interac';
  is_default: boolean;
  is_active: boolean;
  card_last_four?: string;
  card_brand?: string;
  created_at: string;
  updated_at: string;
}
