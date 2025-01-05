import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign } from "lucide-react";

interface PaymentTypeSelectorProps {
  selectedPaymentType: 'interac' | 'credit_card';
  onSelect: (type: 'interac' | 'credit_card') => void;
}

export function PaymentTypeSelector({ selectedPaymentType, onSelect }: PaymentTypeSelectorProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant={selectedPaymentType === 'interac' ? 'default' : 'outline'}
        onClick={() => onSelect('interac')}
        className="flex-1"
      >
        <DollarSign className="h-4 w-4 mr-2" />
        Interac
      </Button>
      <Button
        variant={selectedPaymentType === 'credit_card' ? 'default' : 'outline'}
        onClick={() => onSelect('credit_card')}
        className="flex-1"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Carte de crédit
      </Button>
    </div>
  );
}