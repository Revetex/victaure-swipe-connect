
import { useState } from 'react';
import { getStripeClient } from '@/integrations/stripe/client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePaymentHandler() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (amount: number, description: string) => {
    try {
      setLoading(true);
      const stripe = await getStripeClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Créer un customer s'il n'existe pas déjà
      const { data: customerData } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      let customerId = customerData?.stripe_customer_id;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id
          }
        });

        await supabase
          .from('stripe_customers')
          .insert({
            user_id: user.id,
            stripe_customer_id: customer.id
          });

        customerId = customer.id;
      }

      // Créer la session de paiement
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'cad',
            product_data: {
              name: description,
            },
            unit_amount: amount * 100, // Convertir en centimes
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      });

      // Rediriger vers la page de paiement Stripe
      window.location.href = session.url!;

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Une erreur est survenue lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return {
    handlePayment,
    loading
  };
}
