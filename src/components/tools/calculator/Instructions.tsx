
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marketingDescriptions } from "./types";
import { TransactionType } from "./types";

interface InstructionsProps {
  currentType: TransactionType;
  onHide: () => void;
}

export function Instructions({ currentType, onHide }: InstructionsProps) {
  return (
    <Card className="p-4 bg-primary/5 mb-4">
      <h3 className="font-semibold mb-2">{marketingDescriptions[currentType].title}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {marketingDescriptions[currentType].description}
      </p>
      <div className="space-y-2">
        <h4 className="font-medium">Fonctionnalités :</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {marketingDescriptions[currentType].features.map((feature, index) => (
            <li key={index} className="text-muted-foreground">{feature}</li>
          ))}
        </ul>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mt-4"
        onClick={onHide}
      >
        Masquer les instructions
      </Button>
    </Card>
  );
}
