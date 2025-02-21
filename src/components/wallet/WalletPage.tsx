
import { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  CreditCard,
  WalletCards,
  Plus,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWallet } from "@/hooks/useWallet";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function WalletPage() {
  const [amount, setAmount] = useState("");
  const isMobile = useIsMobile();
  const { wallet, transactions, isLoading, addFunds } = useWallet();

  const handleAddFunds = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }
    addFunds(numAmount);
    setAmount("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Solde et Actions */}
        <Card className="p-6 bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <WalletCards className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Mon Portefeuille</h2>
            </div>
            <Badge variant="outline" className="text-white border-white/20">
              {wallet?.wallet_id}
            </Badge>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-white/80">Solde disponible</p>
            <p className="text-4xl font-bold text-white">
              {wallet?.balance.toFixed(2)} {wallet?.currency}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-white/80 mb-2">Montant</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button
              onClick={handleAddFunds}
              className="w-full bg-white text-purple-600 hover:bg-white/90"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter des fonds
            </Button>
          </div>
        </Card>

        {/* Moyens de paiement */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Moyens de paiement</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">•••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expire 12/24</p>
                </div>
              </div>
              <Badge>Par défaut</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Historique des transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des transactions
          </h3>
          <Button variant="outline" size="sm">
            Tout voir
          </Button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {transaction.sender_wallet_id === wallet?.id ? (
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                ) : (
                  <ArrowDownLeft className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium">
                    {transaction.description || "Transaction"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.created_at), "Pp", { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.sender_wallet_id === wallet?.id 
                    ? "text-red-500" 
                    : "text-green-500"
                }`}>
                  {transaction.sender_wallet_id === wallet?.id ? "-" : "+"}
                  {transaction.amount} {transaction.currency}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  {transaction.status === "completed" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Complété</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">Échoué</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
