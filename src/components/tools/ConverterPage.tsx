import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const categories = [
  {
    name: "Longueur",
    units: [
      { id: "m", name: "Mètres" },
      { id: "km", name: "Kilomètres" },
      { id: "cm", name: "Centimètres" },
      { id: "mm", name: "Millimètres" },
      { id: "ft", name: "Pieds" },
      { id: "in", name: "Pouces" },
    ]
  },
  {
    name: "Poids",
    units: [
      { id: "kg", name: "Kilogrammes" },
      { id: "g", name: "Grammes" },
      { id: "mg", name: "Milligrammes" },
      { id: "lb", name: "Livres" },
      { id: "oz", name: "Onces" },
    ]
  },
  {
    name: "Température",
    units: [
      { id: "c", name: "Celsius" },
      { id: "f", name: "Fahrenheit" },
      { id: "k", name: "Kelvin" },
    ]
  }
];

export function ConverterPage() {
  const [category, setCategory] = useState(categories[0].name);
  const [fromUnit, setFromUnit] = useState(categories[0].units[0].id);
  const [toUnit, setToUnit] = useState(categories[0].units[1].id);
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    if (!value || isNaN(Number(value))) {
      toast.error("Veuillez entrer une valeur numérique valide");
      return;
    }

    // TODO: Implement actual conversion logic
    setResult(`${value} ${fromUnit} = X ${toUnit}`);
  };

  const currentUnits = categories.find(c => c.name === category)?.units || [];

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <Ruler className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Convertisseur</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Catégorie</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ArrowRightLeft className="h-4 w-4" />

            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Valeur</label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Entrez une valeur..."
            />
          </div>

          <Button onClick={handleConvert} className="w-full">
            Convertir
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-center font-medium">
              {result}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}