
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PlayFormProps {
  onSubmit: (numbers: number[], color: string) => void;
  isSubmitting: boolean;
}

export function PlayForm({ onSubmit, isSubmitting }: PlayFormProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const colors = ["Rouge", "Vert", "Bleu", "Jaune", "Violet"];

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
      setSelectedNumbers([]);
      setSelectedColor("");
    }
  };

  const generateRandomNumbers = () => {
    const numbers = Array.from({ length: 50 }, (_, i) => i + 1);
    const randomNumbers = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      randomNumbers.push(numbers[randomIndex]);
      numbers.splice(randomIndex, 1);
    }
    setSelectedNumbers(randomNumbers.sort((a, b) => a - b));
    setSelectedColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">Choisissez 5 numéros</h3>
        
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 50 }, (_, i) => i + 1).map(number => (
            <motion.button
              key={number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(number)}
              className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${selectedNumbers.includes(number) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-primary/20'}`}
            >
              {number}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Choisissez une couleur bonus</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {colors.map(color => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-full transition-colors
                  ${selectedColor === color 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary hover:bg-primary/20'}`}
              >
                {color}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={generateRandomNumbers}
            className="w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Tirage au hasard
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={selectedNumbers.length !== 5 || !selectedColor || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              "Jouer (5$)"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
