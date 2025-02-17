
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

export const getStripeClient = async () => {
  if (!stripePromise) {
    const { data: { publicKey } } = await fetch('/api/stripe/config').then(r => r.json());
    stripePromise = loadStripe(publicKey);
  }
  return stripePromise;
};
