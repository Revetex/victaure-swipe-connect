
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Loader2, Plus, Trash2, AlertTriangle } from "lucide-react";
import { PaymentMethod, PaymentTransaction } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTypeSelector } from "@/components/dashboard/payment/PaymentTypeSelector";
import { toast } from "sonner";
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

export function PaymentSection() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'credit_card' | 'interac'>('credit_card');
  const [addingPayment, setAddingPayment] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
    loadTransactions();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const { data: methods, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      
      const typedMethods = methods?.map(method => ({
        ...method,
        payment_type: method.payment_type as 'credit_card' | 'interac'
      }));
      
      setPaymentMethods(typedMethods || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error("Erreur lors du chargement des méthodes de paiement");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validTransactions = (data || []).map(transaction => {
        // Validate status
        if (!['pending', 'frozen', 'confirmed', 'cancelled'].includes(transaction.status)) {
          console.warn(`Invalid status: ${transaction.status} for transaction ${transaction.id}`);
          transaction.status = 'pending'; // Default to pending if invalid
        }

        // Validate payment_method
        if (!['credit_card', 'interac'].includes(transaction.payment_method)) {
          console.warn(`Invalid payment_method: ${transaction.payment_method} for transaction ${transaction.id}`);
          transaction.payment_method = 'credit_card'; // Default to credit_card if invalid
        }

        // Validate transaction_type
        if (!['job_posting', 'subscription', 'other'].includes(transaction.transaction_type)) {
          console.warn(`Invalid transaction_type: ${transaction.transaction_type} for transaction ${transaction.id}`);
          transaction.transaction_type = 'other'; // Default to other if invalid
        }

        // Cast the transaction to the correct type, including metadata conversion
        const validTransaction: PaymentTransaction = {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status as PaymentTransaction['status'],
          transaction_type: transaction.transaction_type as PaymentTransaction['transaction_type'],
          payment_method: transaction.payment_method as PaymentTransaction['payment_method'],
          metadata: transaction.metadata as Record<string, any>,
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        };

        return validTransaction;
      });

      setTransactions(validTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error("Erreur lors du chargement des transactions");
    }
  };

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

  const addPaymentMethod = async () => {
    try {
      setAddingPayment(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('payment_methods')
        .insert({
          payment_type: selectedType,
          user_id: user.id,
          is_default: paymentMethods.length === 0
        });

      if (error) throw error;
      
      toast.success("Méthode de paiement ajoutée");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error("Erreur lors de l'ajout de la méthode de paiement");
    } finally {
      setAddingPayment(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Méthode de paiement supprimée");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .neq('id', id);

      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Méthode de paiement par défaut mise à jour");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <Card className="p-6 space-y-8">
      {/* Section Méthodes de paiement */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Méthodes de paiement</h2>
          {paymentMethods.length === 0 && (
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Aucune méthode de paiement
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {method.payment_type === 'credit_card' ? 'Carte de crédit' : 'Interac'}
                      {method.is_default && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Par défaut
                        </span>
                      )}
                    </p>
                    {method.card_last_four && (
                      <p className="text-sm text-muted-foreground">
                        {method.card_brand} se terminant par {method.card_last_four}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultPaymentMethod(method.id)}
                    >
                      Définir par défaut
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deletePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-4 space-y-4">
              <PaymentTypeSelector
                selectedPaymentType={selectedType}
                onSelect={setSelectedType}
              />
              
              <Button 
                className="w-full"
                onClick={addPaymentMethod}
                disabled={addingPayment}
              >
                {addingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Ajouter une méthode de paiement
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Section Transactions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Historique des transactions</h2>
        
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
      </div>
    </Card>
  );
}
