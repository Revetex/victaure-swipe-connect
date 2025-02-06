import { CalculatorPage } from "../CalculatorPage";

export function CalculatorSection() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <CalculatorPage />
      </div>
    </div>
  );
}