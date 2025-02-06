import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalculatorKeypadProps {
  onNumber: (num: string) => void;
  onOperation: (op: string) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CalculatorKeypad({
  onNumber,
  onOperation,
  onCalculate,
  onClear,
}: CalculatorKeypadProps) {
  const buttonClass = "h-12 text-lg font-medium transition-all hover:scale-105 active:scale-95";

  return (
    <div className="grid grid-cols-4 gap-2">
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("7")}>7</Button>
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("8")}>8</Button>
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("9")}>9</Button>
      <Button variant="outline" className={cn(buttonClass, "bg-muted/50")} onClick={() => onOperation("/")}>÷</Button>
      
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("4")}>4</Button>
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("5")}>5</Button>
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("6")}>6</Button>
      <Button variant="outline" className={cn(buttonClass, "bg-muted/50")} onClick={() => onOperation("*")}>×</Button>
      
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("1")}>1</Button>
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("2")}>2</Button>
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("3")}>3</Button>
      <Button variant="outline" className={cn(buttonClass, "bg-muted/50")} onClick={() => onOperation("-")}>−</Button>
      
      <Button variant="outline" className={buttonClass} onClick={() => onNumber("0")}>0</Button>
      <Button variant="outline" className={buttonClass} onClick={() => onNumber(".")}>.</Button>
      <Button variant="outline" className={cn(buttonClass, "bg-primary text-primary-foreground hover:bg-primary/90")} onClick={onCalculate}>=</Button>
      <Button variant="outline" className={cn(buttonClass, "bg-muted/50")} onClick={() => onOperation("+")}>+</Button>
      
      <Button variant="outline" className={cn(buttonClass, "col-span-4 bg-destructive/10 hover:bg-destructive/20")} onClick={onClear}>Clear</Button>
    </div>
  );
}