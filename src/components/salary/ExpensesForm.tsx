import { useState } from "react";

interface ExpensesFormProps {
  onSubmit: (data: any) => void;
}

export function ExpensesForm({ onSubmit }: ExpensesFormProps) {
  const [expenses, setExpenses] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ expenses, description });
    setExpenses(0);
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Dépenses</label>
        <input
          type="number"
          value={expenses}
          onChange={(e) => setExpenses(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Soumettre
      </button>
    </form>
  );
}
