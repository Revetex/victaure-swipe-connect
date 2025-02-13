
import { useState } from "react";
import { PaymentTransaction } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTransactions() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validTransactions = (data || []).map(transaction => {
        // Validate status
        if (!['pending', 'frozen', 'confirmed', 'cancelled'].includes(transaction.status)) {
          console.warn(`Invalid status: ${transaction.status} for transaction ${transaction.id}`);
          transaction.status = 'pending'; // Default to pending if invalid
        }

        // Validate payment_method
        if (!['credit_card', 'interac'].includes(transaction.payment_method)) {
          console.warn(`Invalid payment_method: ${transaction.payment_method} for transaction ${transaction.id}`);
          transaction.payment_method = 'credit_card'; // Default to credit_card if invalid
        }

        // Validate transaction_type
        if (!['job_posting', 'subscription', 'other'].includes(transaction.transaction_type)) {
          console.warn(`Invalid transaction_type: ${transaction.transaction_type} for transaction ${transaction.id}`);
          transaction.transaction_type = 'other'; // Default to other if invalid
        }

        // Cast the transaction to the correct type, including metadata conversion
        const validTransaction: PaymentTransaction = {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status as PaymentTransaction['status'],
          transaction_type: transaction.transaction_type as PaymentTransaction['transaction_type'],
          payment_method: transaction.payment_method as PaymentTransaction['payment_method'],
          metadata: transaction.metadata as Record<string, any>,
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        };

        return validTransaction;
      });

      setTransactions(validTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error("Erreur lors du chargement des transactions");
    }
  };

  return {
    transactions,
    loadTransactions
  };
}
