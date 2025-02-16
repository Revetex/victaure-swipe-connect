
import { PaymentTransaction } from "@/types/payment";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface TransactionsListProps {
  transactions: PaymentTransaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center">
          Aucune transaction
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {transaction.amount} {transaction.currency}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(transaction.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm px-2 py-1 rounded-full ${
                transaction.status === 'confirmed' 
                  ? 'bg-green-100 text-green-700'
                  : transaction.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : transaction.status === 'cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {transaction.status === 'confirmed' && 'Confirmé'}
                {transaction.status === 'pending' && 'En attente'}
                {transaction.status === 'cancelled' && 'Annulé'}
                {transaction.status === 'frozen' && 'Gelé'}
              </span>
              <span className="text-sm text-muted-foreground">
                {transaction.payment_method === 'credit_card' ? 'Carte' : 'Interac'}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
