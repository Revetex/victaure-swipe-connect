
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
  const { handlePayment, loading } = usePaymentHandler();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [interacEmail, setInteracEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    await handlePayment(Number(amount), "Paiement via calculatrice");
  };

  const savePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (paymentMethod === "card") {
        if (!cardNumber || !expiryDate || !cvv) {
          toast.error("Veuillez remplir tous les champs");
          return;
        }

        const { error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            payment_type: 'card',
            card_last_four: cardNumber.slice(-4),
            is_default: true,
          });

        if (error) throw error;
      } else {
        if (!interacEmail) {
          toast.error("Veuillez entrer votre email Interac");
          return;
        }

        const { error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            payment_type: 'interac',
            interac_email: interacEmail,
            is_default: true,
          });

        if (error) throw error;
      }

      toast.success("Mode de paiement enregistré");
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setInteracEmail("");
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Montant à payer (CAD)</Label>
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            'Payer maintenant'
          )}
        </Button>
      </form>

      <div className="border-t pt-6">
        <form onSubmit={savePaymentMethod} className="space-y-4">
          <Label>Mode de paiement préféré</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Carte</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="interac" id="interac" className="peer sr-only" />
              <Label
                htmlFor="interac"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Interac</span>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Date d'expiration</Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="interacEmail">Email Interac</Label>
              <Input
                id="interacEmail"
                type="email"
                value={interacEmail}
                onChange={(e) => setInteracEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
          )}

          <Button type="submit" variant="outline" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer le mode de paiement'
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
