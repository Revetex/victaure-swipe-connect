
import { useState } from 'react';
import { getStripeClient } from '@/integrations/stripe/client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePaymentHandler() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (amount: number, description: string) => {
    try {
      setLoading(true);
      
      // Vérifier que l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Veuillez vous connecter pour effectuer un paiement');
      }

      // Initialiser Stripe
      const stripe = await getStripeClient();
      if (!stripe) {
        throw new Error('Erreur lors de l\'initialisation de Stripe');
      }

      // Récupérer ou créer le customer Stripe
      const { data: customerData, error: customerError } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      if (customerError && customerError.code !== 'PGRST116') {
        throw new Error('Erreur lors de la récupération du client');
      }

      // Créer la session de paiement
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          customerId: customerData?.stripe_customer_id
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const session = await response.json();

      // Rediriger vers la page de paiement Stripe
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (stripeError) {
        throw stripeError;
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors du paiement");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handlePayment,
    loading
  };
}
