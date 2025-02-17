
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { kijiji } from 'npm:kijiji-scraper'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are required')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const searchOptions = {
      locationId: 9001, // Code pour Canada
      categoryId: 777, // Pour la section "acheter et vendre"
      sortByName: "date"
    }

    const ads = await kijiji.search(searchOptions)

    const processedListings = ads.map(ad => ({
      title: ad.title,
      description: ad.description,
      price: parseFloat(ad.attributes.price?.replace(/[^0-9.]/g, '') || '0'),
      currency: 'CAD',
      type: 'vente',
      status: 'active',
      external_source: 'kijiji',
      external_id: ad.id,
      external_url: ad.url,
      external_data: {
        attributes: ad.attributes,
        image: ad.image,
        date: ad.date,
        location: ad.location
      },
      images: ad.images || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('marketplace_items')
      .upsert(processedListings, {
        onConflict: 'external_id',
        ignoreDuplicates: false
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, itemsProcessed: processedListings.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
