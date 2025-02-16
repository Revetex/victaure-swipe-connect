
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2 } from "lucide-react";
import { PaymentMethod } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodsList({ methods, onSetDefault, onDelete }: PaymentMethodsListProps) {
  const getCardIcon = (brand?: string) => {
    // Ajoutez plus d'icônes selon les marques de carte
    return <CreditCard className="h-5 w-5 text-muted-foreground" />;
  };

  if (methods.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="py-6 text-center text-muted-foreground">
          <CreditCard className="h-8 w-8 mx-auto mb-2" />
          <p>Aucune méthode de paiement enregistrée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <Card key={method.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getCardIcon(method.card_brand)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {method.payment_type === 'credit_card' 
                        ? `${method.card_brand || 'Carte'} ••••${method.card_last_four}` 
                        : 'Interac'}
                    </p>
                    {method.is_default && (
                      <Badge variant="secondary" className="ml-2">
                        Par défaut
                      </Badge>
                    )}
                  </div>
                  {method.payment_type === 'credit_card' && (
                    <p className="text-sm text-muted-foreground">
                      {method.card_brand}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
