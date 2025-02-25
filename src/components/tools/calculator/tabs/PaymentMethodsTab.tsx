
import { Card } from "@/components/ui/card";
import { PaymentMethodForm } from "@/components/settings/payment/PaymentMethodForm";
import { PaymentTypeSelector } from "@/components/settings/payment/PaymentTypeSelector";
import { PaymentMethodsList } from "@/components/settings/payment/PaymentMethodsList";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { toast } from "sonner";

export function PaymentMethodsTab() {
  const { 
    paymentMethods, 
    selectedType, 
    setSelectedType,
    handleDeleteMethod,
    handleSetDefaultMethod
  } = usePaymentMethods();

  const handleAddPaymentMethod = async (data: any) => {
    try {
      console.log("Nouvelles données de paiement:", data);
      toast.success("Méthode de paiement ajoutée");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout de la méthode de paiement");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ajouter un moyen de paiement</h3>
        <PaymentMethodForm onSubmit={handleAddPaymentMethod} />
      </Card>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Moyens de paiement enregistrés</h3>
          <PaymentTypeSelector
            selectedPaymentType={selectedType}
            onSelect={setSelectedType}
          />
          <PaymentMethodsList
            methods={paymentMethods}
            onSetDefault={handleSetDefaultMethod}
            onDelete={handleDeleteMethod}
          />
        </Card>
      </div>
    </div>
  );
}
