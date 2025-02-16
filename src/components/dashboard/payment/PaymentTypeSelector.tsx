
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface PaymentTypeSelectorProps {
  selectedPaymentType: 'interac' | 'credit_card';
  onSelect: (type: 'interac' | 'credit_card') => void;
}

export function PaymentTypeSelector({ selectedPaymentType, onSelect }: PaymentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card 
        className={`cursor-pointer transition-all ${
          selectedPaymentType === 'credit_card' 
            ? 'ring-2 ring-primary' 
            : 'hover:bg-muted/50'
        }`}
        onClick={() => onSelect('credit_card')}
      >
        <CardContent className="p-6 flex flex-col items-center text-center">
          <CreditCard className={`h-6 w-6 mb-2 ${
            selectedPaymentType === 'credit_card' 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`} />
          <p className="font-medium">Carte de crédit</p>
          <p className="text-sm text-muted-foreground">
            Visa, Mastercard, etc.
          </p>
        </CardContent>
      </Card>

      <Card 
        className={`cursor-pointer transition-all ${
          selectedPaymentType === 'interac' 
            ? 'ring-2 ring-primary' 
            : 'hover:bg-muted/50'
        }`}
        onClick={() => onSelect('interac')}
      >
        <CardContent className="p-6 flex flex-col items-center text-center">
          <DollarSign className={`h-6 w-6 mb-2 ${
            selectedPaymentType === 'interac' 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`} />
          <p className="font-medium">Interac</p>
          <p className="text-sm text-muted-foreground">
            Virement bancaire
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
