
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { categories, marketingDescriptions } from './types';
import type { TransactionType } from './types';

interface TransactionFormProps {
  type: TransactionType;
  amount: number;
  onAmountChange: (amount: number) => void;
  onSubmit: () => void;
}

export function TransactionForm({
  type,
  amount,
  onAmountChange,
  onSubmit
}: TransactionFormProps) {
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast.error("Le montant doit être supérieur à 0");
      return;
    }

    onSubmit();
  };

  const renderSpecificFields = () => {
    if (type === "escrow") {
      return (
        <div className="space-y-4">
          <Label>Date de libération</Label>
          <Input type="date" className="w-full" />
        </div>
      );
    }

    if (type === "auction") {
      return (
        <div className="space-y-4">
          <Label>Prix de départ</Label>
          <Input type="number" className="w-full" />
          <Label>Date de fin</Label>
          <Input type="date" className="w-full" />
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Type de transaction</Label>
          <div className="text-sm text-muted-foreground">
            {marketingDescriptions[type].description}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select 
            value={category}
            onValueChange={setCategory}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Montant</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            min="0"
            step="0.01"
            className="w-full"
          />
        </div>

        {renderSpecificFields()}

        <Button type="submit" className="w-full">
          {type === "escrow" ? "Créer le dépôt" : 
           type === "auction" ? "Démarrer l'enchère" : 
           "Valider le paiement"}
        </Button>
      </form>
    </Card>
  );
}
