
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

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
