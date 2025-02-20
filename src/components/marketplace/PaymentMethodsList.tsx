
import { PaymentMethod } from "@/types/payment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function PaymentMethodsList({ methods, onDelete, isDeleting }: PaymentMethodsListProps) {
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
        <Card key={method.id} className="p-4 flex justify-between items-center">
          <div>
            {method.payment_type === 'credit_card' ? (
              <p>Carte •••• {method.card_last_four}</p>
            ) : (
              <p>Interac {method.email}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(method.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </Card>
      ))}
    </div>
  );
}
