
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

  const sendFundsMutation = useMutation({
    mutationFn: async ({ receiverWalletId, amount }: { receiverWalletId: string; amount: number }) => {
      if (!wallet?.id) throw new Error("Wallet not found");

      // Get receiver's wallet with all necessary fields
      const { data: receiverWallet, error: receiverError } = await supabase
        .from("user_wallets")
        .select("id, balance, currency")
        .eq("wallet_id", receiverWalletId)
        .single();

      if (receiverError) throw new Error("Recipient wallet not found");

      // Use a direct update since the transfer_funds RPC is not yet registered
      const { error: senderError } = await supabase
        .from("user_wallets")
        .update({ balance: wallet.balance - amount })
        .eq("id", wallet.id);

      if (senderError) throw senderError;

      const { error: receiverUpdateError } = await supabase
        .from("user_wallets")
        .update({ balance: (receiverWallet.balance || 0) + amount })
        .eq("id", receiverWallet.id);

      if (receiverUpdateError) throw receiverUpdateError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          sender_wallet_id: wallet.id,
          receiver_wallet_id: receiverWallet.id,
          amount,
          currency: wallet.currency,
          status: 'completed',
          description: 'Wallet transfer'
        });

      if (transactionError) throw transactionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
      toast.success("Funds sent successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const freezeWalletMutation = useMutation({
    mutationFn: async (freeze: boolean) => {
      if (!wallet?.id) throw new Error("Wallet not found");

      const { error } = await supabase
        .from("user_wallets")
        .update({ 
          is_frozen: freeze,
          updated_at: new Date().toISOString()
        })
        .eq("id", wallet.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update wallet status");
      console.error("Freeze wallet error:", error);
    }
  });

  return {
    wallet,
    transactions,
    isLoading,
    sendFunds: (receiverWalletId: string, amount: number) => 
      sendFundsMutation.mutateAsync({ receiverWalletId, amount }),
    freezeWallet: (freeze: boolean) => freezeWalletMutation.mutateAsync(freeze)
  };
}
