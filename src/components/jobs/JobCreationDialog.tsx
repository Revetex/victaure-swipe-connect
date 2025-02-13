
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentTypeSelector } from "@/components/dashboard/payment/PaymentTypeSelector";
import { TransactionList } from "@/components/dashboard/payment/TransactionList";
import { useState } from "react";
import { toast } from "sonner";

interface JobCreationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export function JobCreationDialog({ isOpen, setIsOpen, onSuccess }: JobCreationDialogProps) {
  const [paymentType, setPaymentType] = useState<'interac' | 'credit_card'>('credit_card');

  const handlePayment = async (amount: number) => {
    try {
      // Ici nous simulerons un paiement PayPal
      toast.success("Paiement effectué avec succès");
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Erreur lors du paiement");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une annonce</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <PaymentTypeSelector 
            selectedPaymentType={paymentType}
            onSelect={setPaymentType}
          />

          <TransactionList
            transactions={[
              {
                id: '1',
                amount: 50,
                status: 'frozen',
                payment_type: 'credit_card',
                created_at: new Date().toISOString(),
                match_id: null
              }
            ]}
            onRelease={handlePayment}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
