import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function PaymentPanel() {
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [freezePeriod, setFreezePeriod] = useState("24"); // heures
  const { loading } = usePaymentHandler();
  const [isProcessing, setIsProcessing] = useState(false);

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

      // Créer un paiement en fiducie
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

      toast.success(`Paiement en fiducie #${escrow.id} créé avec succès`);
      setAmount("");
      setRecipientId("");
    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error);
      toast.error("Erreur lors de la création du paiement en fiducie");
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
    } catch (error) {
      console.error("Erreur lors de la libération du paiement:", error);
      toast.error("Erreur lors de la libération du paiement");
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={initiateEscrowPayment} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipientId">ID du Destinataire</Label>
          <Input
            id="recipientId"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="ID du destinataire"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Montant (CAD)</Label>
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
              Traitement en cours...
            </>
          ) : (
            'Créer le paiement en fiducie'
          )}
        </Button>
      </form>

      {/* Liste des paiements en fiducie */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Paiements en Fiducie</h3>
        <div className="space-y-4">
          {/* Cette partie sera implémentée avec les données de Supabase */}
          <p className="text-sm text-muted-foreground">
            Les paiements en fiducie seront listés ici
          </p>
        </div>
      </div>
    </Card>
  );
}
