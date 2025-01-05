import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2 } from "lucide-react";

interface Transaction {
  id: string;
  match_id: string | null;
  amount: number;
  payment_type: 'interac' | 'credit_card';
  status: 'frozen' | 'released' | 'cancelled';
  created_at: string;
  match?: {
    id: string;
    job?: {
      title: string;
    } | null;
  } | null;
}

interface TransactionListProps {
  transactions: Transaction[];
  onRelease: (amount: number) => void;
}

export function TransactionList({ transactions, onRelease }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions?.map((transaction) => (
        <div
          key={transaction.id}
          className="p-4 border rounded-lg flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="font-medium">CAD {transaction.amount}</p>
            <p className="text-sm text-muted-foreground">
              {transaction.status === 'frozen' ? (
                <span className="flex items-center text-yellow-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Gelé
                </span>
              ) : transaction.status === 'released' ? (
                <span className="flex items-center text-green-500">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Libéré
                </span>
              ) : (
                <span className="text-red-500">Annulé</span>
              )}
            </p>
          </div>
          {transaction.status === 'frozen' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRelease(transaction.amount)}
            >
              Libérer
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}