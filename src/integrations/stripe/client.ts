
import Stripe from 'stripe';
import { supabase } from '@/integrations/supabase/client';

let stripePromise: Promise<string>;

export const getStripeKey = async () => {
  if (!stripePromise) {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'STRIPE_SECRET_KEY' }
    });

    if (error) {
      console.error('Error fetching Stripe key:', error);
      throw error;
    }

    stripePromise = Promise.resolve(data.secret);
  }

  return stripePromise;
};

export const getStripeClient = async () => {
  const secret = await getStripeKey();
  return new Stripe(secret, {
    apiVersion: '2023-10-16',
    typescript: true,
  });
};
