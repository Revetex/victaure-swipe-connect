
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const messageId = formData.get('messageId')

    if (!file || !messageId) {
      return new Response(
        JSON.stringify({ error: 'Missing file or messageId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileExt = (file as File).name.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(filePath, file, {
        contentType: (file as File).type,
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: publicUrl } = supabase.storage
      .from('chat-files')
      .getPublicUrl(filePath)

    const { error: attachmentError } = await supabase
      .from('chat_attachments')
      .insert({
        message_id: messageId,
        file_path: filePath,
        file_name: (file as File).name,
        content_type: (file as File).type,
        size: (file as File).size,
      })

    if (attachmentError) {
      throw attachmentError
    }

    // Update message to indicate it has an attachment
    const { error: messageError } = await supabase
      .from('messages')
      .update({ has_attachment: true })
      .eq('id', messageId)

    if (messageError) {
      throw messageError
    }

    return new Response(
      JSON.stringify({ 
        filePath,
        publicUrl: publicUrl.publicUrl,
        fileName: (file as File).name,
        contentType: (file as File).type,
        size: (file as File).size
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
