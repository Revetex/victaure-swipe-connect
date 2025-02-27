
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowDownUp, Wallet, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function WalletOverview() {
  const { wallet, isLoading, stats, refreshWallet } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshWallet();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number, currency: string = 'CAD') => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Mon Portefeuille</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Solde actuel */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
              <Wallet className="mr-2 h-4 w-4" />
              Solde Actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-36" />
            ) : (
              <div className="text-3xl font-bold">
                {wallet ? formatCurrency(wallet.balance, wallet.currency) : '0,00 $'}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Portefeuille ID: {isLoading ? <Skeleton className="h-3 w-24 inline-block" /> : wallet?.wallet_id || 'Non disponible'}
            </p>
          </CardContent>
        </Card>

        {/* Résumé des transactions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Activité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Entrées</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-24 mt-1" />
                ) : (
                  <div className="flex items-center text-green-500 font-semibold">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    {formatCurrency(stats.totalIncoming)}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Sorties</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-24 mt-1" />
                ) : (
                  <div className="flex items-center text-red-500 font-semibold">
                    <TrendingDown className="mr-1 h-4 w-4" />
                    {formatCurrency(stats.totalOutgoing)}
                  </div>
                )}
              </div>
              <div className="col-span-2 mt-1">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {stats.pendingTransactions} transaction{stats.pendingTransactions !== 1 ? 's' : ''} en attente
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
