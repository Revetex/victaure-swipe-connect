
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentPanel } from "./PaymentPanel";
import { useCalculator } from "./useCalculator";
import { toast } from "sonner";

export function CalculatorTab() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const { balance, deposit, withdraw } = useCalculator();

  const handleDeposit = () => {
    if (!depositAmount) return;
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }
    
    deposit(amount);
    setDepositAmount("");
    toast.success(`Dépôt de ${amount.toFixed(2)} CAD effectué`);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }
    
    if (amount > balance) {
      toast.error("Solde insuffisant");
      return;
    }
    
    withdraw(amount);
    setWithdrawAmount("");
    toast.success(`Retrait de ${amount.toFixed(2)} CAD effectué`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Votre solde</h3>
            <p className="text-2xl font-bold">{balance.toFixed(2)} CAD</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="deposit">Déposer</TabsTrigger>
              <TabsTrigger value="withdraw">Retirer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deposit">
              <PaymentPanel 
                type="deposit"
                amount={depositAmount}
                onAmountChange={setDepositAmount}
                onSubmit={handleDeposit}
              />
            </TabsContent>
            
            <TabsContent value="withdraw">
              <PaymentPanel 
                type="withdraw"
                amount={withdrawAmount}
                onAmountChange={setWithdrawAmount}
                onSubmit={handleWithdraw}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setDepositAmount("100")}>
          + 100 CAD
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setDepositAmount("500")}>
          + 500 CAD
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setDepositAmount("1000")}>
          + 1000 CAD
        </Button>
      </div>
    </div>
  );
}
