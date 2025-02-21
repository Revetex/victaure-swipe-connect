
CREATE OR REPLACE FUNCTION public.transfer_funds(
  p_sender_wallet_id UUID,
  p_receiver_wallet_id UUID,
  p_amount NUMERIC
) RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_balance NUMERIC;
  v_sender_frozen BOOLEAN;
BEGIN
  -- Check if sender's wallet exists and get balance
  SELECT balance, is_frozen INTO v_sender_balance, v_sender_frozen
  FROM user_wallets
  WHERE id = p_sender_wallet_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sender wallet not found';
  END IF;

  -- Check if wallet is frozen
  IF v_sender_frozen THEN
    RAISE EXCEPTION 'Sender wallet is frozen';
  END IF;

  -- Check sufficient balance
  IF v_sender_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  -- Update sender's wallet
  UPDATE user_wallets
  SET balance = balance - p_amount
  WHERE id = p_sender_wallet_id;
  
  -- Update receiver's wallet
  UPDATE user_wallets
  SET balance = balance + p_amount
  WHERE id = p_receiver_wallet_id;
  
  -- Create transaction record
  INSERT INTO wallet_transactions (
    sender_wallet_id,
    receiver_wallet_id,
    amount,
    currency,
    description,
    status
  )
  SELECT
    p_sender_wallet_id,
    p_receiver_wallet_id,
    p_amount,
    sender.currency,
    'Wallet transfer',
    'completed'
  FROM user_wallets sender
  WHERE sender.id = p_sender_wallet_id;
END;
$$;

-- Add is_frozen column to user_wallets if it doesn't exist
ALTER TABLE user_wallets 
ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT false;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.transfer_funds(UUID, UUID, NUMERIC) TO authenticated;
