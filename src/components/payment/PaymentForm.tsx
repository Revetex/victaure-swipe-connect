
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useStripePayment } from '@/hooks/useStripePayment';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentForm() {
  const [amount, setAmount] = useState('');
  const { createPaymentIntent, loading } = useStripePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    try {
      console.log('Submitting payment with amount:', numericAmount);
      await createPaymentIntent.mutateAsync({
        amount: numericAmount,
        currency: 'CAD'
      });
      setAmount('');
    } catch (error) {
      console.error('Payment submission error:', error);
    }
  };

  return (
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
            className="relative"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            'Payer'
          )}
        </Button>
      </form>
    </Card>
  );
}
