
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function useStripeElements() {
  const stripe = useStripe();
  const elements = useElements();

  return {
    stripe,
    elements,
    stripePromise
  };
}

export function useStripePayment() {
  const createPaymentIntent = useMutation({
    mutationFn: async ({ amount, currency }: { amount: number; currency: string }) => {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, currency }
      });
      
      if (error) throw error;
      return data;
    }
  });

  return {
    createPaymentIntent,
    loading: createPaymentIntent.isPending
  };
}
