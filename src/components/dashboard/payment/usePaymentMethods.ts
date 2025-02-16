
import { useState } from "react";
import { PaymentMethod } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { useElements } from "@stripe/react-stripe-js";

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'credit_card' | 'interac'>('credit_card');
  const [addingPayment, setAddingPayment] = useState(false);
  const elements = useElements();

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
    if (!elements) {
      toast.error("Impossible d'initialiser le formulaire de paiement");
      return;
    }

    try {
      setAddingPayment(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Initialize Stripe
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      if (!stripe) throw new Error('Stripe non initialisé');

      // Create setup intent
      const { data: setupIntent, error: setupError } = await supabase.functions.invoke('create-setup-intent');
      if (setupError) throw setupError;

      const cardElement = elements.getElement('card');
      if (!cardElement) {
        throw new Error('Élément de carte non trouvé');
      }

      // Open Stripe modal for card input
      const result = await stripe.confirmCardSetup(setupIntent.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user.email
          }
        }
      });

      if (result.error) {
        throw result.error;
      }

      // Save payment method
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          payment_type: selectedType,
          stripe_payment_method_id: result.setupIntent.payment_method,
          is_default: paymentMethods.length === 0,
          is_active: true,
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
      // First, unset all default methods
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .neq('id', id);

      // Then set the new default
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
