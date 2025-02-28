
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface RequestBody {
  amount: number
  senderWalletId: string
  receiverWalletId: string
  description?: string
}

serve(async (req) => {
  // Créer un client Supabase en utilisant les variables d'environnement
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  // Récupérer les données de l'utilisateur authentifié
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser()

  if (userError) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  try {
    const { amount, senderWalletId, receiverWalletId, description = 'Transfert' } = await req.json() as RequestBody

    // Vérifier que les paramètres sont valides
    if (!amount || amount <= 0) {
      throw new Error('Le montant doit être positif')
    }

    if (!senderWalletId || !receiverWalletId) {
      throw new Error('IDs de portefeuille invalides')
    }

    // Vérifier que l'expéditeur possède bien le portefeuille
    const { data: senderWallet, error: senderError } = await supabaseClient
      .from('user_wallets')
      .select('*')
      .eq('id', senderWalletId)
      .single()

    if (senderError || !senderWallet) {
      throw new Error('Portefeuille expéditeur introuvable')
    }

    if (senderWallet.user_id !== user.id) {
      throw new Error('Vous n\'êtes pas autorisé à utiliser ce portefeuille')
    }

    // Vérifier que le portefeuille destinataire existe
    const { data: receiverWallet, error: receiverError } = await supabaseClient
      .from('user_wallets')
      .select('*')
      .eq('id', receiverWalletId)
      .single()

    if (receiverError || !receiverWallet) {
      throw new Error('Portefeuille destinataire introuvable')
    }

    // Vérifier le solde
    if (senderWallet.balance < amount) {
      throw new Error('Solde insuffisant')
    }

    // Démarrer une transaction SQL pour le transfert
    const { data: result, error: transferError } = await supabaseClient.rpc(
      'transfer_funds',
      {
        p_sender_wallet_id: senderWalletId,
        p_receiver_wallet_id: receiverWalletId,
        p_amount: amount,
      }
    )

    if (transferError) {
      throw transferError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Transfert effectué avec succès' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
