
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PaymentTypeSelectorProps {
  paymentType: 'credit_card' | 'interac';
  setPaymentType: (type: 'credit_card' | 'interac') => void;
}

export function PaymentTypeSelector({ paymentType, setPaymentType }: PaymentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Type de paiement</Label>
      <div className="flex gap-4">
        <Button
          type="button"
          variant={paymentType === 'credit_card' ? 'default' : 'outline'}
          onClick={() => setPaymentType('credit_card')}
        >
          Carte de crédit
        </Button>
        <Button
          type="button"
          variant={paymentType === 'interac' ? 'default' : 'outline'}
          onClick={() => setPaymentType('interac')}
        >
          Virement Interac
        </Button>
      </div>
    </div>
  );
}
