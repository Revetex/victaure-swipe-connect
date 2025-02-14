
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentTypeSelector } from "./PaymentTypeSelector";
import { TransactionList } from "./TransactionList";
import { usePayments } from "@/hooks/usePayments";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

export function PaymentHandler() {
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState<'interac' | 'credit_card'>('interac');
  const { escrows, isLoading, createEscrow } = usePayments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount))) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    try {
      await createEscrow({
        amount: Number(amount),
        payment_type: paymentType,
        status: 'frozen',
        currency: 'CAD'
      });
      
      setAmount("");
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Une erreur est survenue lors du paiement");
    }
  };

  const handleRelease = async (amount: number) => {
    toast.success(`Le paiement de ${amount} CAD a été libéré`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Montant (CAD)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <PaymentTypeSelector
            selectedPaymentType={paymentType}
            onSelect={setPaymentType}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Geler le paiement
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Paiements gelés</h3>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoaderIcon className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <TransactionList
            transactions={escrows || []}
            onRelease={handleRelease}
          />
        )}
      </Card>
    </div>
  );
}
