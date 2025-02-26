
import { PaymentMethod } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CreditCard, Trash2, Star, Check } from "lucide-react";

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodsList({ methods, onSetDefault, onDelete }: PaymentMethodsListProps) {
  if (methods.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-container p-8 text-center"
      >
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">
          Aucune méthode de paiement configurée
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {methods.map((method, index) => (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-container group"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-accent/10 text-primary transition-colors group-hover:bg-accent/20">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium group-hover:text-gradient transition-colors">
                  {method.payment_type === 'credit_card' 
                    ? `${method.card_brand} ****${method.card_last_four}`
                    : 'Compte Interac'}
                </p>
                {method.is_default && (
                  <div className="flex items-center space-x-1 text-sm text-primary/80">
                    <Star className="h-3 w-3" />
                    <span>Par défaut</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {!method.is_default && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetDefault(method.id)}
                  className="hover:bg-accent/20"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Par défaut
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(method.id)}
                className="text-destructive hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
