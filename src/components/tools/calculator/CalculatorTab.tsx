
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
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="grid gap-6 md:grid-cols-2 mt-6 max-w-5xl mx-auto"
    >
      <div className="space-y-6">
        <Card className="p-6 relative overflow-hidden backdrop-blur-sm bg-card/95 border-primary/10 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
          <div className="mb-4 flex justify-between items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={calculator.clear}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Effacer tout
            </motion.button>
          </div>
          <CalculatorDisplay value={calculator.display} />
          <CalculatorKeypad 
            onNumber={calculator.handleNumber}
            onOperation={calculator.handleOperation}
            onCalculate={calculator.calculate}
            onClear={calculator.clear}
          />
        </Card>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <PaymentPanel 
            type="fixed"
            amount={amount}
            onAmountChange={setAmount}
            onSubmit={handlePaymentSubmit}
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-gradient-to-br from-card/80 to-background/80 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300"
      >
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
      </motion.div>
    </motion.div>
  );
}
