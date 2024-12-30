import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { PaymentTypeSelector } from "./payment/PaymentTypeSelector";
import { TransactionList } from "./payment/TransactionList";

interface PaymentTransaction {
  id: string;
  match_id: string | null;
  amount: number;
  payment_type: 'interac' | 'credit_card';
  status: 'frozen' | 'released' | 'cancelled';
  created_at: string;
  match?: {
    id: string;
    job?: {
      title: string;
    } | null;
  } | null;
}

export function PaymentBox() {
  const [selectedPaymentType, setSelectedPaymentType] = useState<'interac' | 'credit_card'>('interac');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['payment-transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          id,
          match_id,
          amount,
          payment_type,
          status,
          created_at,
          match:matches (
            id,
            job:jobs(title)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PaymentTransaction[];
    }
  });

  const handlePayment = async (amount: number) => {
    try {
      // In a real application, this would integrate with a payment provider
      toast.info("Cette fonctionnalité sera bientôt disponible");
    } catch (error) {
      toast.error("Une erreur est survenue lors du paiement");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Paiements sécurisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Paiements sécurisés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <PaymentTypeSelector
            selectedPaymentType={selectedPaymentType}
            onSelect={setSelectedPaymentType}
          />
          <TransactionList
            transactions={transactions || []}
            onRelease={handlePayment}
          />
        </div>
      </CardContent>
    </Card>
  );
}