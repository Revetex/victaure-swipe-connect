
import { useEffect, useState } from "react";
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { Converter } from "./calculator/Converter";
import { PaymentPanel } from "./calculator/PaymentPanel";
import { useCalculator } from "./calculator/useCalculator";
import { useConverter } from "./calculator/hooks/useConverter";
import { Card } from "@/components/ui/card";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { toast } from "sonner";
import type { TransactionType } from './calculator/types';

export function CalculatorPage() {
  const calculator = useCalculator();
  const converter = useConverter();
  const [transactionType, setTransactionType] = useState<TransactionType>('fixed');
  const [amount, setAmount] = useState(0);
  const { handlePayment, loading } = usePaymentHandler();

  const handlePaymentSubmit = async () => {
    try {
      if (amount <= 0) {
        toast.error("Le montant doit être supérieur à 0");
        return;
      }

      await handlePayment(amount, "Paiement calculatrice");
      toast.success("Transaction initiée avec succès!");
      setAmount(0);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen pt-16 space-y-8">
      <div className="container max-w-6xl mx-auto p-4 space-y-6">
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

      <section className="w-full bg-white/5 backdrop-blur-sm py-8 border-t border-primary/10">
        <div className="container">
          <h2 className="text-2xl font-semibold text-center mb-8">Nos Tarifs</h2>
          <PricingGrid />
        </div>
      </section>
    </div>
  );
}
