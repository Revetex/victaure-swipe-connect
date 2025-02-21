
import { useEffect, useState } from "react";
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { Converter } from "./calculator/Converter";
import { PaymentPanel } from "./calculator/PaymentPanel";
import { useCalculator } from "./calculator/useCalculator";
import { useConverter } from "./calculator/hooks/useConverter";
import { Card } from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import { initializeStripe } from "@/hooks/useStripePayment";
import { Loader2 } from "lucide-react";
import type { StripeElementsOptions } from '@stripe/stripe-js';
import type { TransactionType } from './calculator/types';

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

export function CalculatorPage() {
  const calculator = useCalculator();
  const converter = useConverter();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionType, setTransactionType] = useState<TransactionType>('fixed');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripe = await initializeStripe();
        if (!stripe) throw new Error('Failed to initialize Stripe');
        setStripePromise(Promise.resolve(stripe));
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initStripe();
  }, []);

  const handlePaymentSubmit = async () => {
    try {
      if (amount <= 0) {
        throw new Error("Le montant doit être supérieur à 0");
      }
      console.log("Payment submitted:", { type: transactionType, amount });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={stripeElementsOptions}>
      <div className="min-h-screen pt-16 container">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card className="p-6 relative overflow-hidden backdrop-blur-sm bg-card/95 border-primary/10">
                <CalculatorDisplay value={calculator.display} />
                <CalculatorKeypad 
                  onNumber={calculator.handleNumber}
                  onOperation={calculator.handleOperation}
                  onCalculate={calculator.calculate}
                  onClear={calculator.clear}
                />
              </Card>
              <PaymentPanel 
                type={transactionType}
                amount={amount}
                onAmountChange={setAmount}
                onSubmit={handlePaymentSubmit}
              />
            </div>
            <Converter 
              conversionType={converter.conversionType}
              fromUnit={converter.fromUnit}
              toUnit={converter.toUnit}
              conversionValue={converter.conversionValue}
              conversionResult={converter.conversionResult}
              onConversionTypeChange={converter.setConversionType}
              onFromUnitChange={converter.setFromUnit}
              onToUnitChange={converter.setToUnit}
              onValueChange={converter.setConversionValue}
              onConvert={converter.handleConversion}
            />
          </div>
        </div>
      </div>
    </Elements>
  );
}
