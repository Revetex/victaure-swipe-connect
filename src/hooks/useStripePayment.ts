
import { loadStripe } from '@stripe/stripe-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

let stripePromise: Promise<any> | null = null;

const getStripePublicKey = async () => {
  const { data: { secret }, error } = await supabase.functions.invoke('get-secret', {
    body: { secretName: 'STRIPE_PUBLIC_KEY' }
  });

  if (error) {
    console.error('Error fetching Stripe public key:', error);
    throw error;
  }

  return secret;
};

export async function initializeStripe() {
  if (!stripePromise) {
    const publicKey = await getStripePublicKey();
    stripePromise = loadStripe(publicKey);
  }
  return stripePromise;
}

export function useStripeElements() {
  return {
    stripePromise: initializeStripe(),
    stripe: useStripe(),
    elements: useElements()
  };
}

export function useStripePayment() {
  const createPaymentIntent = useMutation({
    mutationFn: async ({ amount, currency }: { amount: number; currency: string }) => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount, currency }
        });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Payment error:', error);
        toast.error('Erreur lors de la création du paiement');
        throw error;
      }
    }
  });

  return {
    createPaymentIntent,
    loading: createPaymentIntent.isPending
  };
}
