
import { useState } from "react";
import { useSubscriptionProducts } from "@/hooks/useSubscriptionProducts";
import { useBusinessSubscription } from "@/hooks/useBusinessSubscription";
import { SubscriptionProduct } from "@/types/business";
import { SubscriptionPlan } from "./SubscriptionPlan";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { Loader2 } from "lucide-react";

export function SubscriptionSelector() {
  const { products, isLoading: isLoadingProducts } = useSubscriptionProducts();
  const { subscription } = useBusinessSubscription();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionProduct | null>(null);

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Plans d'abonnement</h2>
        <p className="text-muted-foreground">
          Choisissez le plan qui correspond le mieux à vos besoins.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((plan) => (
          <SubscriptionPlan
            key={plan.id}
            plan={plan}
            isActive={subscription?.product_id === plan.id}
            onSelect={setSelectedPlan}
          />
        ))}
      </div>

      {selectedPlan && (
        <div className="max-w-md mx-auto mt-8">
          <PaymentForm />
        </div>
      )}
    </div>
  );
}
