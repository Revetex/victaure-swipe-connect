
CREATE OR REPLACE FUNCTION public.process_loto_ticket_purchase(
  p_user_id UUID,
  p_amount NUMERIC,
  p_draw_id UUID
) RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mettre à jour le portefeuille de l'utilisateur
  UPDATE user_wallets
  SET balance = balance - p_amount
  WHERE user_id = p_user_id;
  
  -- Mettre à jour la cagnotte du tirage
  UPDATE loto_draws
  SET prize_pool = prize_pool + p_amount
  WHERE id = p_draw_id;
  
  -- Créer une transaction
  INSERT INTO wallet_transactions (
    sender_wallet_id,
    receiver_wallet_id,
    amount,
    currency,
    description,
    status
  )
  SELECT 
    uw.id,
    uw.id,
    p_amount,
    uw.currency,
    'Achat ticket LotoSphere',
    'completed'
  FROM user_wallets uw
  WHERE uw.user_id = p_user_id;
END;
$$;
