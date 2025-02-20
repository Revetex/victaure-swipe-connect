
import { useEffect, useState } from "react";
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { Converter } from "./calculator/Converter";
import { PaymentPanel } from "./calculator/PaymentPanel";
import { useCalculator } from "./calculator/useCalculator";
import { Card } from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import { initializeStripe } from "@/hooks/useStripePayment";
import { Loader2 } from "lucide-react";
import type { StripeElementsOptions } from '@stripe/stripe-js';
import type { ConversionType } from './calculator/types';

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
  const [conversionType, setConversionType] = useState<ConversionType>("currency");
  const [fromUnit, setFromUnit] = useState("CAD");
  const [toUnit, setToUnit] = useState("USD");
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleConvert = () => {
    // Logique de conversion à implémenter
    console.log("Converting:", {
      type: conversionType,
      from: fromUnit,
      to: toUnit,
      value: conversionValue
    });
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
              <Card className="p-6">
                <CalculatorDisplay value={calculator.display} />
                <CalculatorKeypad 
                  onNumber={calculator.handleNumber}
                  onOperation={calculator.handleOperation}
                  onCalculate={calculator.calculate}
                  onClear={calculator.clear}
                />
              </Card>
              <PaymentPanel />
            </div>
            <Converter 
              conversionType={conversionType}
              fromUnit={fromUnit}
              toUnit={toUnit}
              conversionValue={conversionValue}
              conversionResult={conversionResult}
              onConversionTypeChange={setConversionType}
              onFromUnitChange={setFromUnit}
              onToUnitChange={setToUnit}
              onValueChange={setConversionValue}
              onConvert={handleConvert}
            />
          </div>
        </div>
      </div>
    </Elements>
  );
}
