
import { PaymentMethod } from "@/types/payment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onDelete: (id: string) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function PaymentMethodsList({ methods, onDelete, onSetDefault, isDeleting }: PaymentMethodsListProps) {
  if (methods.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Aucune méthode de paiement enregistrée
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {methods.map((method) => (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 flex justify-between items-center">
            <div>
              {method.payment_type === 'credit_card' ? (
                <p>Carte •••• {method.card_last_four}</p>
              ) : (
                <p>Interac {method.email}</p>
              )}
            </div>
            <div className="flex space-x-2">
              {!method.is_default && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetDefault(method.id)}
                >
                  <Star className="h-4 w-4 text-yellow-500" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(method.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
