
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PaymentMethodFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export function PaymentMethodForm({ onSubmit }: PaymentMethodFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{2})/, "$1/$2")
      .slice(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !name) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        cardNumber: cardNumber.replace(/\s/g, ""),
        expiryDate,
        cvv,
        name
      });
      
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
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      <Card className="p-6 glass-container">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Nom sur la carte</label>
            <div className="relative">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="JEAN DUPONT"
                className="glass-input pl-10"
              />
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Numéro de carte</label>
            <div className="relative">
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="glass-input pl-10"
              />
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Date d'expiration</label>
              <div className="relative">
                <Input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="glass-input pl-10"
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">CVV</label>
              <div className="relative">
                <Input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  className="glass-input pl-10"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Button type="submit" className="glass-button w-full" disabled={loading}>
        {loading ? "Ajout en cours..." : "Ajouter cette carte"}
      </Button>
    </motion.form>
  );
}
