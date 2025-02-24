import { useEffect, useState } from "react";
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { Converter } from "./calculator/Converter";
import { PaymentPanel } from "./calculator/PaymentPanel";
import { useCalculator } from "./calculator/useCalculator";
import { useConverter } from "./calculator/hooks/useConverter";
import { Card } from "@/components/ui/card";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { toast } from "sonner";
import { PaymentMethodsList } from "@/components/settings/payment/PaymentMethodsList";
import { PaymentTypeSelector } from "@/components/settings/payment/PaymentTypeSelector";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { CreditCard, Receipt, Calculator } from "lucide-react";
import { TransactionsList } from "@/components/settings/payment/TransactionsList";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import type { TransactionType } from './calculator/types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { PaymentMethodForm } from "@/components/settings/payment/PaymentMethodForm";

export function CalculatorPage() {
  const calculator = useCalculator();
  const converter = useConverter();
  const [transactionType, setTransactionType] = useState<TransactionType>('fixed');
  const [amount, setAmount] = useState(0);
  const { handlePayment, loading } = usePaymentHandler();
  const { 
    paymentMethods, 
    selectedType, 
    setSelectedType,
    handleDeleteMethod,
    handleSetDefaultMethod,
    transactions
  } = usePaymentMethods();

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

  const handleAddPaymentMethod = async (data: any) => {
    try {
      console.log("Nouvelles données de paiement:", data);
      toast.success("Méthode de paiement ajoutée");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout de la méthode de paiement");
    }
  };

  return (
    <div className="min-h-screen pt-16 space-y-8">
      <div className="container max-w-6xl mx-auto p-4">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculatrice
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Moyens de paiement
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="methods">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ajouter un moyen de paiement</h3>
                <PaymentMethodForm onSubmit={handleAddPaymentMethod} />
              </Card>
              
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Moyens de paiement enregistrés</h3>
                  <PaymentTypeSelector
                    selectedPaymentType={selectedType}
                    onSelect={setSelectedType}
                  />
                  <PaymentMethodsList
                    methods={paymentMethods}
                    onSetDefault={handleSetDefaultMethod}
                    onDelete={handleDeleteMethod}
                  />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="p-6">
              <TransactionsList transactions={transactions} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <section className="w-full bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm py-12 border-t border-primary/10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Nos Forfaits</h2>
            <p className="text-muted-foreground mt-2">Choisissez le forfait qui correspond à vos besoins</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Forfait Starter */}
            <Card className="relative border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">STARTER</h3>
                  <Badge variant="secondary" className="bg-[#64B5D9]/20">299 CAD/mois</Badge>
                </div>
                <p className="text-sm text-white/60 mt-2">Idéal pour les petites entreprises</p>
                <ul className="mt-6 space-y-3">
                  {[
                    "8 offres d'emploi actives",
                    "Gestion des candidatures",
                    "30 jours d'affichage",
                    "Commission standard"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-white/80">
                      <Check className="h-4 w-4 text-[#64B5D9]" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant="outline">Commencer</Button>
              </div>
            </Card>

            {/* Forfait Pro */}
            <Card className="relative border-2 border-[#64B5D9] shadow-lg bg-black/40 transform hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#64B5D9] text-white px-4">POPULAIRE</Badge>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">PRO</h3>
                  <Badge variant="secondary" className="bg-[#64B5D9]/20">799 CAD/mois</Badge>
                </div>
                <p className="text-sm text-white/60 mt-2">Pour les entreprises en croissance</p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Offres illimitées",
                    "500 CV dans la base",
                    "45 jours d'affichage",
                    "-10% sur commissions"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-white/80">
                      <Check className="h-4 w-4 text-[#64B5D9]" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6">Commencer</Button>
              </div>
            </Card>

            {/* Forfait Enterprise */}
            <Card className="relative border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">ENTERPRISE</h3>
                  <Badge variant="secondary" className="bg-[#64B5D9]/20">2499 CAD/mois</Badge>
                </div>
                <p className="text-sm text-white/60 mt-2">Solution complète</p>
                <ul className="mt-6 space-y-3">
                  {[
                    "CV illimités",
                    "Visibilité maximale",
                    "Account manager dédié",
                    "-20% sur commissions"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-white/80">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant="outline">Nous contacter</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
