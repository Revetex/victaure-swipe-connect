
import { PaymentTransaction } from "@/types/payment";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  CreditCard, 
  Wallet 
} from "lucide-react";

interface TransactionsListProps {
  transactions: PaymentTransaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'frozen':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      case 'frozen':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return '';
    }
  };

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-container p-8 text-center"
      >
        <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">
          Aucune transaction
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-container p-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-xl ${getStatusStyle(transaction.status)} bg-opacity-10`}>
                {getStatusIcon(transaction.status)}
              </div>
              <div>
                <p className="font-medium text-gradient">
                  {transaction.amount} {transaction.currency}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(transaction.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(transaction.status)}`}>
                {transaction.status === 'confirmed' && 'Confirmé'}
                {transaction.status === 'pending' && 'En attente'}
                {transaction.status === 'cancelled' && 'Annulé'}
                {transaction.status === 'frozen' && 'Gelé'}
              </span>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>
                  {transaction.payment_method === 'credit_card' ? 'Carte' : 'Interac'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
