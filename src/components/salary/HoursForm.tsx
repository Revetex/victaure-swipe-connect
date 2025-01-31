import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HoursFormProps {
  onSubmit: (data: { hours: number; rate: number }) => void;
}

export function HoursForm({ onSubmit }: HoursFormProps) {
  const [hours, setHours] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ hours, rate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="hours" className="block text-sm font-medium">
          Heures travaillées
        </label>
        <input
          type="number"
          id="hours"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="rate" className="block text-sm font-medium">
          Taux horaire
        </label>
        <input
          type="number"
          id="rate"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Suivant
      </Button>
    </form>
  );
}
