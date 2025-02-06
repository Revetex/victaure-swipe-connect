import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Ruler } from "lucide-react";
import { CalculatorPage } from "../CalculatorPage";
import { ConverterPage } from "../ConverterPage";

export function CalculatorSection() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Calculatrice & Convertisseur</h2>
      <Tabs defaultValue="calculator" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculatrice
          </TabsTrigger>
          <TabsTrigger value="converter" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Convertisseur
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="flex-1">
          <CalculatorPage />
        </TabsContent>
        <TabsContent value="converter" className="flex-1">
          <ConverterPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}