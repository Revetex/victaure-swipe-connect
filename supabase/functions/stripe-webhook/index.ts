
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_shared/stripe.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret!
    )

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        await supabaseClient
          .from('payment_transactions')
          .insert([
            {
              user_id: paymentIntent.metadata.user_id,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              status: 'confirmed',
              payment_method: 'credit_card',
              metadata: {
                stripe_payment_intent_id: paymentIntent.id,
                description: paymentIntent.description,
              },
            },
          ])
        break
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object
        if (paymentMethod.customer) {
          const { data: customerData } = await supabaseClient
            .from('stripe_customers')
            .select('user_id')
            .eq('stripe_customer_id', paymentMethod.customer)
            .single()

          if (customerData) {
            await supabaseClient.from('payment_methods').insert([
              {
                user_id: customerData.user_id,
                payment_type: 'credit_card',
                card_brand: paymentMethod.card?.brand,
                card_last_four: paymentMethod.card?.last4,
                stripe_payment_method_id: paymentMethod.id,
              },
            ])
          }
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
