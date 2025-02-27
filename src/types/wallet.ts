
export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  wallet_id: string;
  is_frozen: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  sender_wallet_id: string;
  receiver_wallet_id: string;
  amount: number;
  currency: string;
  description?: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}
