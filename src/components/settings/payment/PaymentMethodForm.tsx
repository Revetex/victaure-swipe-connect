
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Calendar, Lock } from "lucide-react";

interface PaymentMethodFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export function PaymentMethodForm({ onSubmit }: PaymentMethodFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !name) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        cardNumber,
        expiryDate,
        cvv,
        name
      });
      
      // Réinitialiser le formulaire
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setName("");
      
      toast.success("Méthode de paiement ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la méthode de paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom sur la carte</label>
          <div className="relative">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="JEAN DUPONT"
              className="pl-10"
            />
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Numéro de carte</label>
          <div className="relative">
            <Input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className="pl-10"
            />
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date d'expiration</label>
            <div className="relative">
              <Input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/AA"
                maxLength={5}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">CVV</label>
            <div className="relative">
              <Input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                className="pl-10"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Ajout en cours..." : "Ajouter cette carte"}
      </Button>
    </form>
  );
}
