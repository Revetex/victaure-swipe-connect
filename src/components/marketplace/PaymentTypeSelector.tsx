
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PaymentTypeSelectorProps {
  paymentType: 'card' | 'interac';
  setPaymentType: (type: 'card' | 'interac') => void;
}

export function PaymentTypeSelector({ paymentType, setPaymentType }: PaymentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Type de paiement</Label>
      <div className="flex gap-4">
        <Button
          type="button"
          variant={paymentType === 'card' ? 'default' : 'outline'}
          onClick={() => setPaymentType('card')}
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
