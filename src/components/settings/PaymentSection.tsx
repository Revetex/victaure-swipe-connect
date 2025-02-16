
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, ShieldCheck } from "lucide-react";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { PaymentTypeSelector } from "./payment/PaymentTypeSelector";
import { PaymentMethodsList } from "./payment/PaymentMethodsList";
import { TransactionsList } from "./payment/TransactionsList";
import { usePaymentMethods } from "./payment/usePaymentMethods";
import { useTransactions } from "./payment/useTransactions";
import { Elements } from "@stripe/react-stripe-js";
import { initializeStripe } from "@/hooks/useStripePayment";
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { toast } from "sonner";

const stripeElementsOptions: StripeElementsOptions = {
  mode: 'payment',
  currency: 'cad',
  amount: 1000,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0F172A',
    },
  },
};

export function PaymentSection() {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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
    const initStripe = async () => {
      try {
        const stripe = await initializeStripe();
        if (!stripe) {
          throw new Error('Failed to initialize Stripe');
        }
        setStripePromise(Promise.resolve(stripe));
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        toast.error('Erreur lors de l\'initialisation du système de paiement');
      } finally {
        setIsLoading(false);
      }
    };

    initStripe();
    loadPaymentMethods();
    loadTransactions();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise} options={stripeElementsOptions}>
      <Card className="p-6 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Méthodes de paiement</h2>
              <p className="text-sm text-muted-foreground">
                Gérez vos méthodes de paiement en toute sécurité
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-green-500" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              <PaymentMethodsList
                methods={paymentMethods}
                onSetDefault={setDefaultPaymentMethod}
                onDelete={deletePaymentMethod}
              />

              {showPaymentForm ? (
                <div className="space-y-4">
                  <PaymentTypeSelector
                    selectedPaymentType={selectedType}
                    onSelect={setSelectedType}
                  />
                  <PaymentForm />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => setShowPaymentForm(true)}
                  disabled={addingPayment}
                >
                  {addingPayment ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Ajouter une méthode de paiement
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Historique des transactions</h2>
            <p className="text-sm text-muted-foreground">
              Consultez l'historique de vos transactions
            </p>
          </div>
          <TransactionsList transactions={transactions} />
        </div>
      </Card>
    </Elements>
  );
}
