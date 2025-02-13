
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PaymentEscrow = {
  id: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  currency: string;
  status: string;
  bid_id?: string;
  contract_id?: string;
  created_at: string;
  updated_at: string;
  release_conditions?: any;
};

export function usePayments() {
  const { data: escrows, isLoading, error } = useQuery<PaymentEscrow[]>({
    queryKey: ['payment-escrows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('payment_escrows')
        .select('*')
        .or(`payer_id.eq.${user.id},payee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PaymentEscrow[];
    }
  });

  const createEscrow = async (
    escrow: Omit<PaymentEscrow, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer un paiement");
        return;
      }

      const { error } = await supabase
        .from('payment_escrows')
        .insert(escrow);

      if (error) throw error;
      
      toast.success("Le paiement a été gelé avec succès");
    } catch (error) {
      console.error('Error creating escrow:', error);
      toast.error("Une erreur est survenue lors de la création du paiement");
    }
  };

  return {
    escrows,
    isLoading,
    error,
    createEscrow
  };
}
