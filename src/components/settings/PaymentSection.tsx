
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, AlertTriangle } from "lucide-react";
import { PaymentTypeSelector } from "@/components/dashboard/payment/PaymentTypeSelector";
import { Badge } from "@/components/ui/badge";
import { PaymentMethodsList } from "./payment/PaymentMethodsList";
import { TransactionsList } from "./payment/TransactionsList";
import { usePaymentMethods } from "./payment/usePaymentMethods";
import { useTransactions } from "./payment/useTransactions";

export function PaymentSection() {
  const {
    paymentMethods,
    loading,
    selectedType,
    addingPayment,
    setSelectedType,
    loadPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  } = usePaymentMethods();

  const { transactions, loadTransactions } = useTransactions();

  useEffect(() => {
    loadPaymentMethods();
    loadTransactions();
  }, []);

  return (
    <Card className="p-6 space-y-8">
      {/* Section Méthodes de paiement */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Méthodes de paiement</h2>
          {paymentMethods.length === 0 && (
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Aucune méthode de paiement
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <PaymentMethodsList
              methods={paymentMethods}
              onSetDefault={setDefaultPaymentMethod}
              onDelete={deletePaymentMethod}
            />

            <div className="pt-4 space-y-4">
              <PaymentTypeSelector
                selectedPaymentType={selectedType}
                onSelect={setSelectedType}
              />
              
              <Button 
                className="w-full"
                onClick={addPaymentMethod}
                disabled={addingPayment}
              >
                {addingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Ajouter une méthode de paiement
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Section Transactions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Historique des transactions</h2>
        <TransactionsList transactions={transactions} />
      </div>
    </Card>
  );
}
