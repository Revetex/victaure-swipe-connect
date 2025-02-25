
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, CreditCard, Receipt } from "lucide-react";
import { CalculatorTab } from "./calculator/CalculatorTab";
import { PaymentMethodsTab } from "./calculator/tabs/PaymentMethodsTab";
import { TransactionsTab } from "./calculator/tabs/TransactionsTab";
import { SubscriptionPlans } from "./calculator/SubscriptionPlans";

export function CalculatorPage() {
  return (
    <div className="min-h-screen pt-8 space-y-8">
      <div className="container max-w-6xl mx-auto p-4">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
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

          <TabsContent value="calculator">
            <CalculatorTab />
          </TabsContent>

          <TabsContent value="methods">
            <PaymentMethodsTab />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTab />
          </TabsContent>
        </Tabs>
      </div>

      <SubscriptionPlans />
    </div>
  );
}
