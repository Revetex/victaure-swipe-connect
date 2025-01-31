import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function PremiumsForm({ onSubmit }) {
  const [premiumAmount, setPremiumAmount] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (premiumAmount <= 0) {
      toast.error("Le montant de la prime doit être supérieur à zéro.");
      return;
    }
    onSubmit({ premiumAmount, description });
    setPremiumAmount(0);
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Montant de la prime</label>
        <Input
          type="number"
          value={premiumAmount}
          onChange={(e) => setPremiumAmount(Number(e.target.value))}
          placeholder="Entrez le montant de la prime"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Entrez une description"
        />
      </div>
      <Button type="submit">Soumettre</Button>
    </form>
  );
}
