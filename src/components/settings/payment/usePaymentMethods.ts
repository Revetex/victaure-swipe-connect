
import { useState } from "react";
import { PaymentMethod } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'credit_card' | 'interac'>('credit_card');
  const [addingPayment, setAddingPayment] = useState(false);

  const loadPaymentMethods = async () => {
    try {
      const { data: methods, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      
      const typedMethods = methods?.map(method => ({
        ...method,
        payment_type: method.payment_type as 'credit_card' | 'interac'
      }));
      
      setPaymentMethods(typedMethods || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error("Erreur lors du chargement des méthodes de paiement");
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async () => {
    try {
      setAddingPayment(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Initialiser Stripe
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      if (!stripe) throw new Error('Stripe non initialisé');

      // Créer l'intention de configuration
      const { data: setupIntent, error: setupError } = await supabase.functions.invoke('create-setup-intent');
      if (setupError) throw setupError;

      // Ouvrir la modal Stripe pour la saisie de la carte
      const result = await stripe.confirmCardSetup(setupIntent.client_secret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            email: user.email
          }
        }
      });

      if (result.error) {
        throw result.error;
      }

      // Sauvegarder la méthode de paiement
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          payment_type: selectedType,
          stripe_payment_method_id: result.setupIntent.payment_method,
          is_default: paymentMethods.length === 0
        });

      if (error) throw error;
      
      toast.success("Méthode de paiement ajoutée");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error(error.message || "Erreur lors de l'ajout de la méthode de paiement");
    } finally {
      setAddingPayment(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Méthode de paiement supprimée");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
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
      
      toast.success("Méthode de paiement par défaut mise à jour");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return {
    paymentMethods,
    loading,
    selectedType,
    addingPayment,
    setSelectedType,
    loadPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  };
}
