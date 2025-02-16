
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTransaction } from "@/types/payment";
import { toast } from "sonner";

export function useTransactions() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  const loadTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error("Erreur lors du chargement des transactions");
    }
  };

  return {
    transactions,
    loadTransactions
  };
}
