import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { record } = await req.json()
  const { id, email, raw_user_meta_data } = record

  try {
    const { error } = await supabaseClient
      .from('profiles')
      .insert({
        id,
        email,
        full_name: `${raw_user_meta_data.first_name} ${raw_user_meta_data.last_name}`,
        phone: raw_user_meta_data.phone,
        role: 'professional'
      })

    if (error) throw error

    return new Response(JSON.stringify({ message: 'Profile created successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})