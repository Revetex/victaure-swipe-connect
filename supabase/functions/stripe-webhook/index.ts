
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.18.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Missing Stripe secret key');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Récupérer la signature webhook depuis les headers
    const sig = req.headers.get('stripe-signature');
    if (!sig) {
      throw new Error('No Stripe signature found');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    // Récupérer le body de la requête
    const body = await req.text();
    
    // Vérifier la signature
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Initialiser le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Gérer les différents événements
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent, supabaseClient);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription, supabaseClient);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent, supabaseClient: any) {
  const customerId = paymentIntent.customer;
  if (!customerId) return;

  // Récupérer l'utilisateur associé au customer Stripe
  const { data: customerData, error: customerError } = await supabaseClient
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (customerError) {
    console.error('Error fetching customer:', customerError);
    return;
  }

  // Mettre à jour la transaction
  await supabaseClient
    .from('payment_transactions')
    .insert({
      user_id: customerData.user_id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: 'confirmed',
      payment_method: 'credit_card',
      transaction_type: 'payment',
      metadata: {
        stripe_payment_id: paymentIntent.id,
        description: paymentIntent.description
      }
    });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription, supabaseClient: any) {
  const customerId = subscription.customer;
  if (typeof customerId !== 'string') return;

  // Récupérer l'utilisateur associé au customer Stripe
  const { data: customerData, error: customerError } = await supabaseClient
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (customerError) {
    console.error('Error fetching customer:', customerError);
    return;
  }

  // Mettre à jour l'abonnement
  await supabaseClient
    .from('subscriptions')
    .upsert({
      user_id: customerData.user_id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    });
}
