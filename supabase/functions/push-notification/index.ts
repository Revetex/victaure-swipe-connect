import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import webpush from 'https://esm.sh/web-push@3.6.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { subscription, title, message } = await req.json()

    // Configure web-push with your VAPID keys
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      Deno.env.get('VAPID_PUBLIC_KEY') || '',
      Deno.env.get('VAPID_PRIVATE_KEY') || ''
    )

    // Send the push notification
    await webpush.sendNotification(subscription, JSON.stringify({
      title,
      message,
    }))

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending push notification:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})