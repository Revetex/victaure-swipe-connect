
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";

interface PlayFormProps {
  onSubmit: (numbers: number[], color: string) => void;
  isSubmitting: boolean;
}

const COLORS = ['Rouge', 'Vert', 'Bleu', 'Jaune', 'Violet'];

export function PlayForm({ onSubmit, isSubmitting }: PlayFormProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleSubmit = () => {
    if (selectedNumbers.length === 5 && selectedColor) {
      onSubmit(selectedNumbers, selectedColor);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Sélectionnez 5 numéros</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 50 }, (_, i) => i + 1).map(number => (
            <Button
              key={number}
              variant={selectedNumbers.includes(number) ? "default" : "outline"}
              className="h-10 w-10 p-0"
              onClick={() => handleNumberClick(number)}
            >
              {number}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Choisissez une couleur bonus</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <Badge
              key={color}
              variant={selectedColor === color ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </Badge>
          ))}
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={handleSubmit}
        disabled={selectedNumbers.length !== 5 || !selectedColor || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Achat en cours...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Acheter un ticket (5$)
          </>
        )}
      </Button>
    </Card>
  );
}
