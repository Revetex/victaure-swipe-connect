
import { loadStripe } from '@stripe/stripe-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

let stripePromise: Promise<any> | null = null;
let stripePublicKey: string | null = null;

const getStripePublicKey = async () => {
  if (stripePublicKey) return stripePublicKey;

  try {
    const { data: { secret }, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'STRIPE_PUBLIC_KEY' }
    });

    if (error) throw error;
    if (!secret) throw new Error('No Stripe public key found');

    stripePublicKey = secret;
    return secret;
  } catch (error) {
    console.error('Error fetching Stripe public key:', error);
    toast.error('Erreur lors de la récupération de la clé Stripe');
    throw error;
  }
};

export async function initializeStripe() {
  if (!stripePromise) {
    try {
      const publicKey = await getStripePublicKey();
      if (!publicKey) {
        throw new Error('No Stripe public key available');
      }
      const stripe = await loadStripe(publicKey);
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }
      stripePromise = Promise.resolve(stripe);
      return stripePromise;
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      toast.error('Erreur lors de l\'initialisation de Stripe');
      return null;
    }
  }
  return stripePromise;
}

export function useStripeElements() {
  const stripe = useStripe();
  const elements = useElements();

  return {
    stripe,
    elements
  };
}

interface PaymentIntentResponse {
  clientSecret: string;
}

export function useStripePayment() {
  const createPaymentIntent = useMutation<PaymentIntentResponse, Error, { amount: number; currency: string }>({
    mutationFn: async ({ amount, currency = 'cad' }) => {
      try {
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
          throw new Error('Le montant doit être un nombre positif');
        }

        console.log('Creating payment intent with amount:', amount, 'currency:', currency);

        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase()
          }
        });
        
        if (error) {
          console.error('Payment intent creation error:', error);
          throw error;
        }

        console.log('Payment intent created:', data);
        return data as PaymentIntentResponse;
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
