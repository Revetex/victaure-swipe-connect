
import { PaymentMethod } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Trash2 } from "lucide-react";

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodsList({ methods, onSetDefault, onDelete }: PaymentMethodsListProps) {
  if (methods.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center">
          Aucune méthode de paiement configurée
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <Card key={method.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {method.payment_type === 'credit_card' 
                    ? `${method.card_brand} ****${method.card_last_four}`
                    : 'Compte Interac'}
                </p>
                {method.is_default && (
                  <p className="text-sm text-muted-foreground">Par défaut</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {!method.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetDefault(method.id)}
                >
                  Définir par défaut
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(method.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
