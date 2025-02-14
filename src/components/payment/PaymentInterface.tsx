
import { useState } from 'react';
import { useStripePayment } from '@/hooks/useStripePayment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CreditCard, Lock } from 'lucide-react';

export function PaymentInterface() {
  const [amount, setAmount] = useState('');
  const { createPaymentIntent, loading } = useStripePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount))) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    try {
      await createPaymentIntent.mutateAsync({
        amount: Number(amount) * 100, // Conversion en cents pour Stripe
        currency: 'CAD'
      });
    } catch (error) {
      console.error('Erreur paiement:', error);
      toast.error("Une erreur est survenue lors du paiement");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <Card className="p-6 backdrop-blur-sm bg-background/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Paiement sécurisé</h2>
          </div>
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (CAD)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="pl-8"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              'Payer maintenant'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <Lock className="h-4 w-4" />
            Paiement sécurisé via Stripe
          </p>
        </div>
      </Card>
    </div>
  );
}
