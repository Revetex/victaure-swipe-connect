
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserWallet, WalletTransaction } from "@/types/wallet";
import { toast } from "sonner";

export function useWallet() {
  const queryClient = useQueryClient();

  const { data: wallet, isLoading } = useQuery({
    queryKey: ["userWallet"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const { data, error } = await supabase
        .from("user_wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data as UserWallet;
    }
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["walletTransactions"],
    queryFn: async () => {
      if (!wallet?.id) return [];

      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .or(`sender_wallet_id.eq.${wallet.id},receiver_wallet_id.eq.${wallet.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WalletTransaction[];
    },
    enabled: !!wallet?.id
  });

  const addFundsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!wallet?.id) throw new Error("Portefeuille non trouvé");

      // Simuler l'ajout de fonds via Stripe/autre méthode de paiement
      const { error } = await supabase
        .from("user_wallets")
        .update({ 
          balance: wallet.balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq("id", wallet.id);

      if (error) throw error;

      // Créer la transaction
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert([{
          sender_wallet_id: wallet.id,
          receiver_wallet_id: wallet.id,
          amount,
          currency: wallet.currency,
          status: 'completed',
          description: 'Rechargement du compte'
        }]);

      if (transactionError) throw transactionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
      toast.success("Fonds ajoutés avec succès");
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de l'ajout des fonds");
    }
  });

  return {
    wallet,
    transactions,
    isLoading,
    addFunds: addFundsMutation.mutate
  };
}
