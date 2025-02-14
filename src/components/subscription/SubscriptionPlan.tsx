
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SubscriptionProduct } from "@/types/business";

interface SubscriptionPlanProps {
  plan: SubscriptionProduct;
  isActive?: boolean;
  onSelect: (plan: SubscriptionProduct) => void;
}

export function SubscriptionPlan({ plan, isActive, onSelect }: SubscriptionPlanProps) {
  const features = Object.entries(plan.features).map(([key, value]) => {
    if (typeof value === "boolean") {
      return key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }
    return `${value} ${key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`;
  });

  return (
    <Card className={`p-6 space-y-4 ${isActive ? 'border-primary' : ''}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-muted-foreground">{plan.description}</p>
      </div>

      <div className="text-center">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="text-muted-foreground">/{plan.interval}</span>
      </div>

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelect(plan)}
        variant={isActive ? "default" : "outline"}
        className="w-full"
      >
        {isActive ? "Plan actuel" : "Sélectionner"}
      </Button>
    </Card>
  );
}
