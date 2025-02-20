
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTypeSelector } from "./PaymentTypeSelector";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { usePaymentMethods } from "./usePaymentMethods";
import { Loader2 } from "lucide-react";

export function PaymentMethodForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'credit_card' | 'interac'>('credit_card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    interacEmail: '',
  });

  const { methods, isDeleting, deletePaymentMethod, loadPaymentMethods } = usePaymentMethods();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (paymentType === 'credit_card') {
        const { error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            payment_type: 'credit_card',
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

      toast.success("Méthode de paiement ajoutée");
      await loadPaymentMethods();
      setFormData({
        cardNumber: '',
        expiry: '',
        cvc: '',
        interacEmail: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error("Impossible d'ajouter la méthode de paiement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <PaymentTypeSelector 
        paymentType={paymentType}
        setPaymentType={setPaymentType}
      />

      {paymentType === 'credit_card' ? (
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
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Ajout en cours...
          </>
        ) : (
          "Ajouter la méthode de paiement"
        )}
      </Button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Méthodes de paiement enregistrées</h3>
        <PaymentMethodsList
          methods={methods}
          onDelete={deletePaymentMethod}
          isDeleting={isDeleting}
        />
      </div>
    </form>
  );
}
