import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { PaymentTypeSelector } from "./payment/PaymentTypeSelector";
import { TransactionList } from "./payment/TransactionList";
import { usePayments } from "@/hooks/usePayments";
import { useState } from "react";

export function PaymentBox() {
  const [selectedPaymentType, setSelectedPaymentType] = useState<'interac' | 'credit_card'>('interac');
  const { transactions, isLoading, handlePayment } = usePayments();

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