
export interface UserWallet {
  id: string;
  user_id: string;
  wallet_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  sender_wallet_id: string;
  receiver_wallet_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'frozen';
  description?: string;
  created_at: string;
  updated_at: string;
}

export type TransferFormData = {
  receiverWalletId: string;
  amount: number;
  description?: string;
};
