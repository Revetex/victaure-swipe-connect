
import { WalletTransaction, WalletStats } from '@/types/wallet';

export function calculateWalletStats(transactions: WalletTransaction[], walletId: string): WalletStats {
  let incoming = 0;
  let outgoing = 0;
  let pending = 0;

  transactions.forEach(tx => {
    if (tx.status === 'completed') {
      if (tx.receiver_wallet_id === walletId) {
        incoming += tx.amount;
      } else if (tx.sender_wallet_id === walletId) {
        outgoing += tx.amount;
      }
    } else if (tx.status === 'pending') {
      pending++;
    }
  });

  return {
    totalIncoming: incoming,
    totalOutgoing: outgoing,
    pendingTransactions: pending,
    lastTransaction: transactions[0]
  };
}

export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency
  }).format(amount);
}
