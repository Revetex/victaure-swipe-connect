
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserWallet, WalletTransaction, TransferFormData } from '@/types/wallet';
import { toast } from 'sonner';

export function useWallet() {
  const [loading, setLoading] = useState(false);
  
  const getWallet = async (): Promise<UserWallet | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du wallet:', error);
      return null;
    }
  };

  const transferMoney = async ({ receiverWalletId, amount, description }: TransferFormData) => {
    try {
      setLoading(true);
      const senderWallet = await getWallet();
      if (!senderWallet) throw new Error('Wallet non trouvé');
      if (senderWallet.balance < amount) throw new Error('Solde insuffisant');

      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert([{
          sender_wallet_id: senderWallet.id,
          receiver_wallet_id: receiverWalletId,
          amount,
          description,
          status: 'frozen'
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Transaction créée et gelée en attente de confirmation');
      return data;
    } catch (error) {
      console.error('Erreur de transfert:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du transfert');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTransactions = async (): Promise<WalletTransaction[]> => {
    try {
      const wallet = await getWallet();
      if (!wallet) return [];

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .or(`sender_wallet_id.eq.${wallet.id},receiver_wallet_id.eq.${wallet.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      return [];
    }
  };

  return {
    getWallet,
    transferMoney,
    getTransactions,
    loading
  };
}
