import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentTransaction {
  id: string;
  match_id: string | null;
  amount: number;
  payment_type: 'interac' | 'credit_card';
  status: 'frozen' | 'released' | 'cancelled';
  created_at: string;
  match?: {
    id: string;
    job?: {
      title: string;
    } | null;
  } | null;
}

export function usePayments() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['payment-transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          id,
          match_id,
          amount,
          payment_type,
          status,
          created_at,
          match:matches (
            id,
            job:jobs(title)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PaymentTransaction[];
    }
  });

  const handlePayment = async (amount: number) => {
    try {
      toast.info("Cette fonctionnalité sera bientôt disponible");
    } catch (error) {
      toast.error("Une erreur est survenue lors du paiement");
    }
  };

  return {
    transactions,
    isLoading,
    handlePayment
  };
}