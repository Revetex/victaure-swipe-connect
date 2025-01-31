import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AllowancesFormProps {
  onSubmit: (data: { allowances: number }) => void;
}

export function AllowancesForm({ onSubmit }: AllowancesFormProps) {
  const [allowances, setAllowances] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ allowances });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="allowances" className="block text-sm font-medium">
          Indemnités
        </label>
        <Input
          type="number"
          id="allowances"
          value={allowances}
          onChange={(e) => setAllowances(Number(e.target.value))}
          placeholder="Entrez le montant des indemnités"
          required
        />
      </div>
      <Button type="submit">Sauvegarder Indemnités</Button>
    </form>
  );
}
