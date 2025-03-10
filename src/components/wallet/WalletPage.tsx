
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { WalletOverview } from "./WalletOverview";
import { TransactionsList } from "./TransactionsList";
import { TransferForm } from "./TransferForm";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";
import { 
  BanknoteIcon, 
  AreaChart, 
  ArrowRightLeft, 
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function WalletPage() {
  const { transactions, isLoading, wallet } = useWallet();
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-4xl px-4 py-6"
    >
      <WalletOverview />
      
      <div className="mt-8">
        <Tabs defaultValue="transactions">
          <TabsList className={cn(
            "grid mb-6 w-full",
            isMobile ? "grid-cols-3" : "grid-cols-3 max-w-2xl mx-auto"
          )}>
            <TabsTrigger value="transactions" className="flex items-center justify-center">
              <ArrowRightLeft className={cn("h-4 w-4", !isMobile && "mr-2")} />
              {!isMobile && <span>Transactions</span>}
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center justify-center">
              <BanknoteIcon className={cn("h-4 w-4", !isMobile && "mr-2")} />
              {!isMobile && <span>Transférer</span>}
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="flex items-center justify-center">
              <CreditCard className={cn("h-4 w-4", !isMobile && "mr-2")} />
              {!isMobile && <span>Méthodes de paiement</span>}
            </TabsTrigger>
          </TabsList>
          
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            "border rounded-xl bg-gradient-to-b from-background/80 to-background p-6"
          )}>
            <TabsContent value="transactions" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <h3 className="text-xl font-semibold flex items-center">
                <AreaChart className="mr-2 h-5 w-5 text-primary" />
                Historique des transactions
              </h3>
              <TransactionsList 
                transactions={transactions} 
                isLoading={isLoading}
                walletId={wallet?.id}
              />
            </TabsContent>
            
            <TabsContent value="transfer" className="focus-visible:outline-none focus-visible:ring-0">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BanknoteIcon className="mr-2 h-5 w-5 text-primary" />
                Transférer des fonds
              </h3>
              <TransferForm />
            </TabsContent>
            
            <TabsContent value="payment-methods" className="focus-visible:outline-none focus-visible:ring-0">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Méthodes de paiement
              </h3>
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Ajoutez une méthode de paiement pour recharger votre portefeuille facilement.
                  </p>
                  <Button className="mx-auto">
                    Ajouter une méthode de paiement
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
}
