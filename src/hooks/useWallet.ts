
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { UserWallet, WalletTransaction, WalletStats } from '@/types/wallet';
import { 
  fetchUserWallet, 
  fetchWalletById, 
  fetchWalletTransactions, 
  transferFundsAPI 
} from '@/services/walletService';
import { calculateWalletStats } from '@/utils/walletUtils';

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

  // Charger les transactions du portefeuille
  const loadTransactions = async (walletId: string) => {
    try {
      const data = await fetchWalletTransactions(walletId);
      setTransactions(data);
      const calculatedStats = calculateWalletStats(data, walletId);
      setStats(calculatedStats);
    } catch (error: any) {
      console.error('Erreur lors du chargement des transactions:', error.message);
      // Ne pas afficher de toast ici car c'est une fonction interne
    }
  };

  // Charger les informations du portefeuille
  useEffect(() => {
    async function loadWallet() {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Récupérer le portefeuille de l'utilisateur
        const walletData = await fetchUserWallet(user.id);

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

  // Actualiser les données du portefeuille
  const refreshWallet = async () => {
    if (!wallet?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchWalletById(wallet.id);
      
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
      await transferFundsAPI(wallet.id, receiverWalletId, amount, description);
      
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
