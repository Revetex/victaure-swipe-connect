
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PaymentEscrow {
  id: string;
  amount: number;
  status: 'frozen' | 'released' | 'cancelled';
  created_at: string;
  release_conditions: {
    freeze_period_hours: number;
    release_date: string;
  };
  payee_id: string;
}

export function PaymentPanel() {
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [freezePeriod, setFreezePeriod] = useState("24"); // heures
  const { loading } = usePaymentHandler();
  const [isProcessing, setIsProcessing] = useState(false);
  const [escrows, setEscrows] = useState<PaymentEscrow[]>([]);
  const [isLoadingEscrows, setIsLoadingEscrows] = useState(true);

  useEffect(() => {
    loadEscrows();
  }, []);

  const loadEscrows = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_escrows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEscrows(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
      toast.error("Erreur lors du chargement des paiements en fiducie");
    } finally {
      setIsLoadingEscrows(false);
    }
  };

  const initiateEscrowPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipientId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Créer le dépôt dans la boîte de paiement Victaure
      const { data: escrow, error: escrowError } = await supabase
        .from('payment_escrows')
        .insert({
          payer_id: user.id,
          payee_id: recipientId,
          amount: Number(amount),
          release_conditions: {
            freeze_period_hours: Number(freezePeriod),
            release_date: new Date(Date.now() + Number(freezePeriod) * 3600000).toISOString()
          }
        })
        .select()
        .single();

      if (escrowError) throw escrowError;

      toast.success(`Dépôt effectué dans la boîte Victaure #${escrow.id.slice(0, 8)}`);
      setAmount("");
      setRecipientId("");
      loadEscrows();
    } catch (error) {
      console.error("Erreur lors du dépôt:", error);
      toast.error("Erreur lors du dépôt dans la boîte Victaure");
    } finally {
      setIsProcessing(false);
    }
  };

  const releasePayment = async (escrowId: string) => {
    try {
      const { error } = await supabase
        .from('payment_escrows')
        .update({ status: 'released' })
        .eq('id', escrowId);

      if (error) throw error;
      toast.success("Paiement libéré avec succès");
      loadEscrows();
    } catch (error) {
      console.error("Erreur lors de la libération du paiement:", error);
      toast.error("Erreur lors de la libération du paiement");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={initiateEscrowPayment} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipientId">Numéro de Boîte Victaure</Label>
          <Input
            id="recipientId"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="Entrez le numéro de boîte du destinataire"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Montant du Dépôt (CAD)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Période de Gel</Label>
          <RadioGroup 
            value={freezePeriod} 
            onValueChange={setFreezePeriod}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24" id="24h" />
              <Label htmlFor="24h">24 heures</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="72" id="72h" />
              <Label htmlFor="72h">72 heures</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="168" id="7d" />
              <Label htmlFor="7d">7 jours</Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isProcessing || loading}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Dépôt en cours...
            </>
          ) : (
            'Effectuer le dépôt'
          )}
        </Button>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Dépôts en Boîte Victaure</h3>
        {isLoadingEscrows ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : escrows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Aucun dépôt en boîte Victaure
          </p>
        ) : (
          <div className="space-y-4">
            {escrows.map((escrow) => (
              <Card key={escrow.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Boîte Victaure #{escrow.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      Montant du dépôt: {escrow.amount} CAD
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date de libération: {formatDate(escrow.release_conditions.release_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Statut: {escrow.status === 'frozen' ? 'Gelé' : escrow.status === 'released' ? 'Libéré' : 'Annulé'}
                    </p>
                  </div>
                  {escrow.status === 'frozen' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => releasePayment(escrow.id)}
                    >
                      Libérer le dépôt
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
