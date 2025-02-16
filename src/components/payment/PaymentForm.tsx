
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useStripePayment } from '@/hooks/useStripePayment';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Elements, useStripe, useElements, type StripeElementsOptions } from '@stripe/react-stripe-js';

export function PaymentForm() {
  const [amount, setAmount] = useState('');
  const { createPaymentIntent, loading } = useStripePayment();
  const stripe = useStripe();
  const elements = useElements();
  
  const [elementsOptions, setElementsOptions] = useState<StripeElementsOptions>({
    mode: 'payment',
    currency: 'cad',
    amount: 1000, // Default minimum amount of 10 CAD (in cents)
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0F172A',
      },
    },
  });

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setElementsOptions(prev => ({
        ...prev,
        amount: Math.round(numericAmount * 100), // Convert to cents
      }));
    }
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast.error('Le système de paiement n\'est pas initialisé');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    try {
      console.log('Submitting payment with amount:', numericAmount);
      const { clientSecret } = await createPaymentIntent.mutateAsync({
        amount: numericAmount,
        currency: 'CAD'
      });

      if (!clientSecret) {
        throw new Error('No client secret received');
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      setAmount('');
      toast.success('Paiement effectué avec succès');
    } catch (error) {
      console.error('Payment submission error:', error);
      toast.error('Erreur lors du paiement');
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

        <Button type="submit" className="w-full" disabled={loading || !stripe}>
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
