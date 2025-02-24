
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_shared/stripe.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'cad', description } = await req.json()

    if (!amount || amount <= 0) {
      throw new Error('Amount is required and must be greater than 0')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError) throw userError

    // Récupérer ou créer un client Stripe
    const { data: customerData } = await supabaseClient
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let stripeCustomerId = customerData?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      stripeCustomerId = customer.id

      await supabaseClient
        .from('stripe_customers')
        .insert([{ user_id: user.id, stripe_customer_id: customer.id }])
    }

    // Créer l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      customer: stripeCustomerId,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Enregistrer l'intention de paiement dans la base de données
    await supabaseClient.from('payment_intents').insert([
      {
        user_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount,
        currency: currency,
        metadata: { description },
      },
    ])

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
