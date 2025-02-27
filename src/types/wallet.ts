
// Types pour le portefeuille et les transactions

export type WalletTransaction = {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'frozen';
  description: string;
  sender_wallet_id?: string;
  receiver_wallet_id?: string;
};

export type UserWallet = {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  wallet_id: string;
  created_at: string;
  updated_at: string;
};

export type WalletStats = {
  totalIncoming: number;
  totalOutgoing: number;
  pendingTransactions: number;
  lastTransaction?: WalletTransaction;
};
