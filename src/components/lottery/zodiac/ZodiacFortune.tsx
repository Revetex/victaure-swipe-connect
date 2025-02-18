
import { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Moon } from "lucide-react";
import { toast } from "sonner";

export function ZodiacFortune() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const zodiacSign = getRandomZodiacSign(); // Simulé pour la démo

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < 4) {
      setSelectedNumbers(prev => [...prev, number]);
    } else {
      toast.error("Vous ne pouvez sélectionner que 4 numéros");
    }
  };

  const handlePlay = () => {
    if (selectedNumbers.length !== 4) {
      toast.error("Veuillez sélectionner 4 numéros");
      return;
    }
    toast.success("Ticket validé ! Résultats au prochain tirage.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Zodiac Fortune</h2>
          <p className="text-muted-foreground">Votre signe: {zodiacSign}</p>
        </div>
        <Badge variant="outline" className="text-yellow-500">
          <Star className="h-4 w-4 mr-1" /> Prochain tirage: 20h00
        </Badge>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Sélectionnez vos 4 numéros porte-bonheur</h3>
        <motion.div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 88 }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={selectedNumbers.includes(number) ? "default" : "outline"}
              onClick={() => handleNumberSelect(number)}
              className="h-10 w-10 p-0"
            >
              {number}
            </Button>
          ))}
        </motion.div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Événements Célestes
          </h3>
          <ul className="space-y-2 text-sm">
            <li>🌕 Pleine Lune: Dans 3 jours</li>
            <li>⭐ Pluie de météores: Ce week-end</li>
            <li>☿ Mercure rétrograde: Dans 2 semaines</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Prochains Jackpots
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Alignement Parfait: 3 000 000 CAD$</li>
            <li>Harmonie Céleste: 500 000 CAD$</li>
            <li>Constellation Chanceuse: 100 000 CAD$</li>
          </ul>
        </Card>
      </div>

      <Button 
        onClick={handlePlay}
        className="w-full"
        disabled={selectedNumbers.length !== 4}
      >
        Valider mon ticket
      </Button>
    </div>
  );
}

function getRandomZodiacSign() {
  const signs = [
    "Bélier", "Taureau", "Gémeaux", "Cancer", 
    "Lion", "Vierge", "Balance", "Scorpion",
    "Sagittaire", "Capricorne", "Verseau", "Poissons"
  ];
  return signs[Math.floor(Math.random() * signs.length)];
}
