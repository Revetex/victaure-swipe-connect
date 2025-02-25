
import { Card } from "@/components/ui/card";
import { TransactionsList } from "@/components/settings/payment/TransactionsList";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export function TransactionsTab() {
  const { transactions } = usePaymentMethods();

  return (
    <Card className="p-6">
      <TransactionsList transactions={transactions} />
    </Card>
  );
}
