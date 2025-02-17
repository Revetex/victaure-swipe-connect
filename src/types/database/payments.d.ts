
export interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  client_secret?: string;
}

export interface StripeCustomer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
}
