
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentTransaction } from '@/types/payment';
import { toast } from 'sonner';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [selectedType, setSelectedType] = useState<'credit_card' | 'interac'>('credit_card');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
    loadTransactions();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;

      // Conversion explicite des données pour s'assurer qu'elles correspondent au type PaymentMethod
      const typedMethods: PaymentMethod[] = data?.map(method => ({
        id: method.id,
        user_id: method.user_id,
        payment_type: method.payment_type as 'credit_card' | 'interac',
        card_brand: method.card_brand,
        card_last_four: method.card_last_four,
        email: method.email,
        is_default: method.is_default,
        is_active: method.is_active,
        created_at: method.created_at,
        updated_at: method.updated_at,
        stripe_payment_method_id: method.stripe_payment_method_id
      })) || [];

      setPaymentMethods(typedMethods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error("Erreur lors du chargement des méthodes de paiement");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Conversion explicite des données pour s'assurer qu'elles correspondent au type PaymentTransaction
      const typedTransactions: PaymentTransaction[] = data?.map(transaction => ({
        id: transaction.id,
        user_id: transaction.user_id,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status as 'confirmed' | 'pending' | 'cancelled' | 'frozen',
        payment_method: transaction.payment_method as 'credit_card' | 'interac',
        created_at: transaction.created_at,
        description: transaction.description
      })) || [];

      setTransactions(typedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error("Erreur lors du chargement des transactions");
    }
  };

  const handleDeleteMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await loadPaymentMethods();
      toast.success("Méthode de paiement supprimée");
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSetDefaultMethod = async (id: string) => {
    try {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .neq('id', id);

      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      await loadPaymentMethods();
      toast.success("Méthode de paiement par défaut mise à jour");
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return {
    paymentMethods,
    transactions,
    selectedType,
    setSelectedType,
    loading,
    handleDeleteMethod,
    handleSetDefaultMethod,
  };
}
