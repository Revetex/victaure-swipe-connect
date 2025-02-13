
import { PaymentTransaction } from "@/types/payment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface TransactionsListProps {
  transactions: PaymentTransaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const getStatusBadge = (status: PaymentTransaction['status']) => {
    const statusConfig = {
      pending: { className: "bg-yellow-500", text: "En attente" },
      frozen: { className: "bg-blue-500", text: "Gelé" },
      confirmed: { className: "bg-green-500", text: "Confirmé" },
      cancelled: { className: "bg-red-500", text: "Annulé" }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Aucune transaction
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.created_at), 'PPP', { locale: fr })}
                </TableCell>
                <TableCell>
                  {transaction.transaction_type === 'job_posting' 
                    ? 'Publication d\'offre' 
                    : transaction.transaction_type === 'subscription'
                    ? 'Abonnement'
                    : 'Autre'}
                </TableCell>
                <TableCell>
                  {transaction.amount} {transaction.currency}
                </TableCell>
                <TableCell>
                  {transaction.payment_method === 'credit_card' 
                    ? 'Carte de crédit' 
                    : 'Interac'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
