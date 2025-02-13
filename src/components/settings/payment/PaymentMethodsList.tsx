
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2 } from "lucide-react";
import { PaymentMethod } from "@/types/payment";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodsList({ methods, onSetDefault, onDelete }: PaymentMethodsListProps) {
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <div 
          key={method.id} 
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {method.payment_type === 'credit_card' ? 'Carte de crédit' : 'Interac'}
                {method.is_default && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Par défaut
                  </span>
                )}
              </p>
              {method.card_last_four && (
                <p className="text-sm text-muted-foreground">
                  {method.card_brand} se terminant par {method.card_last_four}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
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
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => onDelete(method.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
