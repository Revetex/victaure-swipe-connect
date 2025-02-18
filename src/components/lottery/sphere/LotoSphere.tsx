
import { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Diamond, Crown, Gift } from "lucide-react";
import { toast } from "sonner";

export function LotoSphere() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers(prev => [...prev, number]);
    } else {
      toast.error("Vous ne pouvez sélectionner que 5 numéros");
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handlePlay = () => {
    if (selectedNumbers.length !== 5 || !selectedColor) {
      toast.error("Veuillez sélectionner 5 numéros et une couleur");
      return;
    }
    toast.success("Ticket validé ! Résultats au prochain tirage.");
  };

  const colors = [
    { name: "Rouge", class: "bg-red-500" },
    { name: "Vert", class: "bg-green-500" },
    { name: "Bleu", class: "bg-blue-500" },
    { name: "Jaune", class: "bg-yellow-500" },
    { name: "Violet", class: "bg-purple-500" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">LotoSphere</h2>
          <p className="text-muted-foreground">Cagnotte actuelle: 5 000 000 CAD$</p>
        </div>
        <Badge variant="outline" className="text-yellow-500">
          <Crown className="h-4 w-4 mr-1" /> Prochain tirage: 21h00
        </Badge>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Sélectionnez vos 5 numéros</h3>
        <motion.div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 50 }, (_, i) => i + 1).map((number) => (
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

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Choisissez votre couleur bonus</h3>
        <div className="flex gap-4">
          {colors.map((color) => (
            <Button
              key={color.name}
              variant="outline"
              onClick={() => handleColorSelect(color.name)}
              className={`h-12 w-12 rounded-full ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary' : ''} ${color.class}`}
            />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Diamond className="h-4 w-4" />
            Programme VIP
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Bronze: 1 ticket gratuit / 5 participations</li>
            <li>Argent: +5% sur les gains</li>
            <li>Or: +10% sur les gains</li>
            <li>Platine: 1 ticket gratuit / jour</li>
            <li>Diamant: 2 tickets gratuits / jour</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Événements en cours
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Lundi Magique: -50% sur les tickets</li>
            <li>Mercredi: Gains ×2</li>
            <li>Vendredi: 1000 codes gagnants</li>
            <li>Week-end: Tickets VIP gratuits</li>
          </ul>
        </Card>
      </div>

      <Button 
        onClick={handlePlay}
        className="w-full"
        disabled={selectedNumbers.length !== 5 || !selectedColor}
      >
        Valider mon ticket (5 CAD$)
      </Button>
    </div>
  );
}
