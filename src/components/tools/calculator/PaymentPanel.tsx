
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function PaymentPanel() {
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [freezePeriod, setFreezePeriod] = useState("24"); // heures
  const [isProcessing, setIsProcessing] = useState(false);
  const [bidType, setBidType] = useState<'escrow' | 'auction'>('escrow');
  const [auctionEndDate, setAuctionEndDate] = useState<string>("");
  const [minimumBid, setMinimumBid] = useState("");

  const initiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (bidType === 'auction') {
        const { data: auction, error: auctionError } = await supabase
          .from('marketplace_services')
          .insert({
            provider_id: user.id,
            title: "Enchère",
            type: "auction",
            price: Number(minimumBid),
            currency: "CAD",
            auction_end_date: new Date(auctionEndDate).toISOString()
          })
          .select()
          .single();

        if (auctionError) throw auctionError;
        
        toast.success("Enchère créée avec succès", {
          description: `L'enchère se termine le ${new Date(auctionEndDate).toLocaleDateString()}`
        });

      } else {
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
      }

      // Reset form
      setAmount("");
      setRecipientId("");
      setAuctionEndDate("");
      setMinimumBid("");

    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error);
      toast.error("Erreur lors de la création du paiement en fiducie");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={initiatePayment} className="space-y-4">
        <RadioGroup value={bidType} onValueChange={(value: 'escrow' | 'auction') => setBidType(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="escrow" id="escrow" />
            <Label htmlFor="escrow">Paiement en fiducie</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auction" id="auction" />
            <Label htmlFor="auction">Enchère</Label>
          </div>
        </RadioGroup>

        {bidType === 'escrow' ? (
          <>
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
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="minimumBid">Enchère minimum (CAD)</Label>
              <Input
                id="minimumBid"
                type="number"
                value={minimumBid}
                onChange={(e) => setMinimumBid(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auctionEnd">Fin des enchères</Label>
              <Input
                id="auctionEnd"
                type="datetime-local"
                value={auctionEndDate}
                onChange={(e) => setAuctionEndDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          </>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin border-2 border-white/20 border-t-white rounded-full" />
              Traitement en cours...
            </>
          ) : bidType === 'escrow' ? (
            'Créer le paiement en fiducie'
          ) : (
            'Créer l'enchère'
          )}
        </Button>
      </form>

      {/* Liste des enchères actives */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Enchères en cours</h3>
        <div className="space-y-4">
          {/* Cette partie sera implémentée avec les données de Supabase */}
          <p className="text-sm text-muted-foreground">
            Les enchères en cours seront listées ici
          </p>
        </div>
      </div>
    </Card>
  );
}
