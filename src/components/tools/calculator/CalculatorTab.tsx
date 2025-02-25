
import { Card } from "@/components/ui/card";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorKeypad } from "./CalculatorKeypad";
import { PaymentPanel } from "./PaymentPanel";
import { Converter } from "./Converter";
import { useCalculator } from "./useCalculator";
import { useConverter } from "./hooks/useConverter";
import { useState } from "react";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { toast } from "sonner";

export function CalculatorTab() {
  const calculator = useCalculator();
  const converter = useConverter();
  const [amount, setAmount] = useState(0);
  const { handlePayment } = usePaymentHandler();

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
    <div className="grid gap-6 md:grid-cols-2 mt-4">
      <div className="space-y-6">
        <Card className="p-4 relative overflow-hidden backdrop-blur-sm bg-card/95 border-primary/10 shadow-lg">
          <div className="mb-4 flex justify-between items-center">
            <button 
              onClick={calculator.clear}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Effacer tout
            </button>
          </div>
          <CalculatorDisplay value={calculator.display} />
          <CalculatorKeypad 
            onNumber={calculator.handleNumber}
            onOperation={calculator.handleOperation}
            onCalculate={calculator.calculate}
            onClear={calculator.clear}
          />
        </Card>
        <PaymentPanel 
          type="fixed"
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
  );
}
