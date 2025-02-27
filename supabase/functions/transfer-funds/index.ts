
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransferRequest {
  amount: number;
  senderWalletId: string;
  receiverWalletId: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    // Vérifier la méthode de requête
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer les données de la requête
    const data: TransferRequest = await req.json();
    const { amount, senderWalletId, receiverWalletId, description } = data;

    // Validation des données
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Le montant doit être supérieur à 0' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!senderWalletId || !receiverWalletId) {
      return new Response(
        JSON.stringify({ error: 'Les identifiants de portefeuille sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que les portefeuilles existent
    const { data: senderWallet, error: senderError } = await supabaseClient
      .from('user_wallets')
      .select('*')
      .eq('id', senderWalletId)
      .single();

    if (senderError || !senderWallet) {
      console.error('Erreur lors de la récupération du portefeuille source:', senderError);
      return new Response(
        JSON.stringify({ error: 'Portefeuille source introuvable' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: receiverWallet, error: receiverError } = await supabaseClient
      .from('user_wallets')
      .select('*')
      .eq('id', receiverWalletId)
      .single();

    if (receiverError || !receiverWallet) {
      console.error('Erreur lors de la récupération du portefeuille destinataire:', receiverError);
      return new Response(
        JSON.stringify({ error: 'Portefeuille destinataire introuvable' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier le solde
    if (senderWallet.balance < amount) {
      return new Response(
        JSON.stringify({ error: 'Solde insuffisant' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Exécuter les opérations dans une transaction
      const { error: txError } = await supabaseClient.rpc('transfer_funds', {
        p_sender_wallet_id: senderWalletId,
        p_receiver_wallet_id: receiverWalletId,
        p_amount: amount,
        p_description: description,
        p_currency: senderWallet.currency
      });

      if (txError) {
        throw txError;
      }

      // Réponse avec succès
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Transfert effectué avec succès'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      
      return new Response(
        JSON.stringify({ error: 'Erreur lors du transfert: ' + error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Erreur globale:', error);
    
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
