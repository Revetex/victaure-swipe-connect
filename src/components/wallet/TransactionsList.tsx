
import { WalletTransaction } from "@/hooks/useWallet";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionsListProps {
  transactions: WalletTransaction[];
  isLoading: boolean;
  walletId?: string;
}

export function TransactionsList({ transactions, isLoading, walletId }: TransactionsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'frozen':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Ban className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'failed':
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      case 'frozen':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      case 'cancelled': return 'Annulé';
      case 'frozen': return 'Gelé';
      default: return status;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'CAD') => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl border bg-card">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8 border rounded-lg bg-card"
      >
        <p className="text-muted-foreground">
          Aucune transaction à afficher
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => {
        const isReceiving = transaction.receiver_wallet_id === walletId;
        
        return (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl border hover:border-primary/30 transition-colors group bg-card/50 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusStyle(transaction.status)}`}>
                  {isReceiving ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {isReceiving ? 'Reçu' : 'Envoyé'}: {transaction.description || 'Transaction'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`font-medium ${isReceiving ? 'text-green-500' : 'text-red-500'}`}>
                  {isReceiving ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(transaction.status)}`}>
                  {getStatusText(transaction.status)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {transactions.length > 0 && (
        <div className="flex justify-center pt-2 pb-6">
          <Button variant="outline" size="sm">
            Afficher plus
          </Button>
        </div>
      )}
    </div>
  );
}
