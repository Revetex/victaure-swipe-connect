
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { Loader2 } from "lucide-react";

export function PaymentPanel() {
  const [amount, setAmount] = useState("");
  const { handlePayment, loading } = usePaymentHandler();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    await handlePayment(Number(amount), "Paiement via calculatrice");
  };

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Montant à payer (CAD)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            'Payer maintenant'
          )}
        </Button>
      </form>
    </Card>
  );
}
