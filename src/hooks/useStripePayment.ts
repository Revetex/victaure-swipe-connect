import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

const STRIPE_PUBLISHABLE_KEY = 'pk_live_51QsA1qP81SjrpHwZtEEXH47DNbu9Uv5EIo1p3tD8FZBSWU4yLRcCcHKbRryaZVi4NcRKpiXx9hxhITg5XASiMyss00HFqJd6Ur';

export function useStripePayment() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: paymentIntents, isLoading: isLoadingIntents } = useQuery({
    queryKey: ['payment-intents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('payment_intents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createPaymentIntent = useMutation({
    mutationFn: async ({ amount, currency = 'CAD' }: { amount: number, currency?: string }) => {
      setLoading(true);
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount, currency }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const paymentIntent: StripePaymentIntent = await response.json();

        // Save the payment intent in our database
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('payment_intents')
          .insert({
            user_id: user.id,
            stripe_payment_intent_id: paymentIntent.id,
            amount: amount,
            currency: currency,
            status: paymentIntent.status,
          });

        if (error) throw error;

        return paymentIntent;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-intents'] });
      toast.success('Paiement initialisé avec succès');
    },
    onError: (error) => {
      console.error('Payment error:', error);
      toast.error('Erreur lors de l\'initialisation du paiement');
    }
  });

  const confirmPayment = async (clientSecret: string, paymentMethod: { id: string }) => {
    setLoading(true);
    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe not initialized');

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success('Paiement effectué avec succès');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Confirm payment error:', error);
      toast.error('Erreur lors de la confirmation du paiement');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentIntents,
    isLoadingIntents,
    loading,
    createPaymentIntent,
    confirmPayment
  };
}

async function getStripe() {
  if (typeof window === 'undefined') return null;
  
  const { loadStripe } = await import('@stripe/stripe-js');
  return await loadStripe(STRIPE_PUBLISHABLE_KEY);
}
