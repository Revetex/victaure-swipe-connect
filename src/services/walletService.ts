
import { supabase } from '@/integrations/supabase/client';
import { UserWallet, WalletTransaction } from '@/types/wallet';

export async function fetchUserWallet(userId: string): Promise<UserWallet | null> {
  const { data, error } = await supabase
    .from('user_wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erreur lors du chargement du portefeuille:', error.message);
    throw error;
  }

  return data;
}

export async function fetchWalletById(walletId: string): Promise<UserWallet | null> {
  const { data, error } = await supabase
    .from('user_wallets')
    .select('*')
    .eq('id', walletId)
    .single();

  if (error) {
    console.error('Erreur lors du chargement du portefeuille:', error.message);
    throw error;
  }

  return data;
}

export async function fetchWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .or(`sender_wallet_id.eq.${walletId},receiver_wallet_id.eq.${walletId}`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Erreur lors du chargement des transactions:', error.message);
    throw error;
  }

  return data as WalletTransaction[];
}

export async function transferFundsAPI(
  senderWalletId: string, 
  receiverWalletId: string, 
  amount: number, 
  description: string = 'Transfert'
): Promise<boolean> {
  const { error } = await supabase.functions.invoke('transfer-funds', {
    body: {
      amount,
      senderWalletId,
      receiverWalletId,
      description
    }
  });

  if (error) {
    console.error('Erreur lors du transfert:', error.message);
    throw error;
  }

  return true;
}
