import { CalculatorPage } from "../CalculatorPage";

export function CalculatorSection() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Calculatrice & Convertisseur</h2>
      <div className="flex-1">
        <CalculatorPage />
      </div>
    </div>
  );
}