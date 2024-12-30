import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Lock, DollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
          <div className="flex gap-4">
            <Button
              variant={selectedPaymentType === 'interac' ? 'default' : 'outline'}
              onClick={() => setSelectedPaymentType('interac')}
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Interac
            </Button>
            <Button
              variant={selectedPaymentType === 'credit_card' ? 'default' : 'outline'}
              onClick={() => setSelectedPaymentType('credit_card')}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Carte de crédit
            </Button>
          </div>

          <div className="space-y-4">
            {transactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium">CAD {transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.status === 'frozen' ? (
                      <span className="flex items-center text-yellow-500">
                        <Lock className="h-4 w-4 mr-1" />
                        Gelé
                      </span>
                    ) : transaction.status === 'released' ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Libéré
                      </span>
                    ) : (
                      <span className="text-red-500">Annulé</span>
                    )}
                  </p>
                </div>
                {transaction.status === 'frozen' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePayment(transaction.amount)}
                  >
                    Libérer
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}