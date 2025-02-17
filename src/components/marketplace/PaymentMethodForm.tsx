
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function PaymentMethodForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'interac'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    interacEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (paymentType === 'card') {
        const { error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            payment_type: 'card',
            card_last_four: formData.cardNumber.slice(-4),
            is_default: true,
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payment_settings')
          .update({
            interac_email: formData.interacEmail,
            interac_enabled: true,
          })
          .eq('user_id', user.id);

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Méthode de paiement ajoutée",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la méthode de paiement",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Type de paiement</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={paymentType === 'card' ? 'default' : 'outline'}
            onClick={() => setPaymentType('card')}
          >
            Carte de crédit
          </Button>
          <Button
            type="button"
            variant={paymentType === 'interac' ? 'default' : 'outline'}
            onClick={() => setPaymentType('interac')}
          >
            Virement Interac
          </Button>
        </div>
      </div>

      {paymentType === 'card' ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Numéro de carte</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Date d'expiration</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={formData.cvc}
                onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value }))}
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="interacEmail">Email Interac</Label>
          <Input
            id="interacEmail"
            type="email"
            value={formData.interacEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, interacEmail: e.target.value }))}
            required
          />
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Ajout en cours..." : "Ajouter la méthode de paiement"}
      </Button>
    </form>
  );
}
