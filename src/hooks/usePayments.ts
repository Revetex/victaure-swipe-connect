
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PaymentTypes } from "@/types/database/payments";

type PaymentEscrow = PaymentTypes['Tables']['payment_escrows']['Row'];

export function usePayments() {
  const { data: escrows, isLoading, error } = useQuery({
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
    payment: Omit<PaymentTypes['Tables']['payment_escrows']['Insert'], 'payer_id'>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer un paiement");
        return;
      }

      const { error } = await supabase
        .from('payment_escrows')
        .insert({
          ...payment,
          payer_id: user.id,
          status: 'frozen'
        });

      if (error) throw error;
      
      toast.success("Le paiement a été gelé avec succès");
    } catch (error) {
      console.error('Error creating escrow:', error);
      toast.error("Une erreur est survenue lors de la création du paiement");
    }
  };

  const releasePayment = async (escrowId: string) => {
    try {
      const { error } = await supabase
        .from('payment_escrows')
        .update({ status: 'released' })
        .eq('id', escrowId);

      if (error) throw error;
      
      toast.success("Le paiement a été libéré avec succès");
    } catch (error) {
      console.error('Error releasing payment:', error);
      toast.error("Une erreur est survenue lors de la libération du paiement");
    }
  };

  const disputePayment = async (escrowId: string) => {
    try {
      const { error } = await supabase
        .from('payment_escrows')
        .update({ status: 'disputed' })
        .eq('id', escrowId);

      if (error) throw error;
      
      toast.success("Le litige a été ouvert avec succès");
    } catch (error) {
      console.error('Error disputing payment:', error);
      toast.error("Une erreur est survenue lors de l'ouverture du litige");
    }
  };

  return {
    escrows,
    isLoading,
    error,
    createEscrow,
    releasePayment,
    disputePayment
  };
}
