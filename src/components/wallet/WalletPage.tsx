
import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { UserWallet, WalletTransaction } from '@/types/wallet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

export function WalletPage() {
  const { getWallet, transferMoney, getTransactions, loading } = useWallet();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [receiverWalletId, setReceiverWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    const walletData = await getWallet();
    setWallet(walletData);
    const transactionsData = await getTransactions();
    setTransactions(transactionsData);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!amount || !receiverWalletId) {
        toast.error('Veuillez remplir tous les champs requis');
        return;
      }

      await transferMoney({
        receiverWalletId,
        amount: Number(amount),
        description
      });

      setReceiverWalletId('');
      setAmount('');
      setDescription('');
      loadWalletData();
    } catch (error) {
      console.error('Erreur de transfert:', error);
    }
  };

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Mon Wallet</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">ID du Wallet</p>
          <p className="font-mono bg-muted p-2 rounded">{wallet.wallet_id}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Solde</p>
          <p className="text-2xl font-bold">{wallet.balance} {wallet.currency}</p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Envoyer de l'argent</h3>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">ID du Wallet destinataire</label>
            <Input
              value={receiverWalletId}
              onChange={(e) => setReceiverWalletId(e.target.value)}
              placeholder="ID du wallet destinataire"
              required
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Montant ({wallet.currency})</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Montant"
              required
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Description (optionnel)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du transfert"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : null}
            Envoyer
          </Button>
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Transactions récentes</h3>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {transaction.sender_wallet_id === wallet.id ? 'Envoyé' : 'Reçu'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.description || 'Pas de description'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={transaction.sender_wallet_id === wallet.id ? 'text-red-500' : 'text-green-500'}>
                    {transaction.sender_wallet_id === wallet.id ? '-' : '+'}{transaction.amount} {transaction.currency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-muted-foreground">Aucune transaction</p>
          )}
        </div>
      </Card>
    </div>
  );
}
