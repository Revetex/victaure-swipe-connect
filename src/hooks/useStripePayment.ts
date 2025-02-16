
import { loadStripe } from '@stripe/stripe-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

let stripePromise: Promise<any> | null = null;

const getStripePublicKey = async () => {
  try {
    const { data: { secret }, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'STRIPE_PUBLIC_KEY' }
    });

    if (error) throw error;
    if (!secret) throw new Error('No Stripe public key found');

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
      stripePromise = loadStripe(publicKey);
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
    stripePromise: initializeStripe(),
    stripe,
    elements
  };
}

export function useStripePayment() {
  const createPaymentIntent = useMutation({
    mutationFn: async ({ amount, currency = 'cad' }: { amount: number; currency: string }) => {
      try {
        // Vérifier que le montant est un nombre valide
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
          throw new Error('Le montant doit être un nombre positif');
        }

        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            amount: Math.round(amount * 100), // Convertir en centimes
            currency: currency.toLowerCase()
          }
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
