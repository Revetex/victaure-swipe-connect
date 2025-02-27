
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<WalletStats>({
    totalIncoming: 0,
    totalOutgoing: 0,
    pendingTransactions: 0
  });

  // Charger les informations du portefeuille
  useEffect(() => {
    async function loadWallet() {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Récupérer le portefeuille de l'utilisateur
        const { data: walletData, error: walletError } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (walletError) {
          throw walletError;
        }

        if (walletData) {
          setWallet(walletData);
          
          // Charger les transactions après avoir obtenu le portefeuille
          await loadTransactions(walletData.id);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement du portefeuille:', error.message);
        toast.error('Impossible de charger votre portefeuille');
      } finally {
        setIsLoading(false);
      }
    }

    loadWallet();
  }, [user?.id]);

  // Charger les transactions du portefeuille
  const loadTransactions = async (walletId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .or(`sender_wallet_id.eq.${walletId},receiver_wallet_id.eq.${walletId}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        setTransactions(data as WalletTransaction[]);
        calculateStats(data as WalletTransaction[], walletId);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des transactions:', error.message);
    }
  };

  // Calculer les statistiques du portefeuille
  const calculateStats = (transactions: WalletTransaction[], walletId: string) => {
    let incoming = 0;
    let outgoing = 0;
    let pending = 0;

    transactions.forEach(tx => {
      if (tx.status === 'completed') {
        if (tx.receiver_wallet_id === walletId) {
          incoming += tx.amount;
        } else if (tx.sender_wallet_id === walletId) {
          outgoing += tx.amount;
        }
      } else if (tx.status === 'pending') {
        pending++;
      }
    });

    setStats({
      totalIncoming: incoming,
      totalOutgoing: outgoing,
      pendingTransactions: pending,
      lastTransaction: transactions[0]
    });
  };

  // Actualiser les données du portefeuille
  const refreshWallet = async () => {
    if (!wallet?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('id', wallet.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setWallet(data);
        await loadTransactions(data.id);
      }
      
      toast.success('Portefeuille actualisé');
    } catch (error: any) {
      console.error('Erreur lors de l\'actualisation du portefeuille:', error.message);
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setIsLoading(false);
    }
  };

  // Effectuer un transfert 
  const transferFunds = async (amount: number, receiverWalletId: string, description: string = 'Transfert') => {
    if (!wallet) {
      toast.error('Portefeuille non disponible');
      return false;
    }
    
    if (amount <= 0) {
      toast.error('Le montant doit être supérieur à 0');
      return false;
    }
    
    if (amount > wallet.balance) {
      toast.error('Solde insuffisant');
      return false;
    }
    
    try {
      const { error } = await supabase.functions.invoke('transfer-funds', {
        body: {
          amount,
          senderWalletId: wallet.id,
          receiverWalletId,
          description
        }
      });

      if (error) throw error;
      
      toast.success('Transfert effectué avec succès');
      await refreshWallet();
      return true;
    } catch (error: any) {
      console.error('Erreur lors du transfert:', error.message);
      toast.error('Erreur lors du transfert: ' + error.message);
      return false;
    }
  };

  return {
    wallet,
    transactions,
    isLoading,
    stats,
    refreshWallet,
    transferFunds
  };
}
