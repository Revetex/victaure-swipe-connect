
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Crown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { NumericSelector } from './NumericSelector';
import { PyramidLevel } from './PyramidLevel';

export function PyramidRush() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [currentGains, setCurrentGains] = useState(0);
  const [isRushHour, setIsRushHour] = useState(false);

  useEffect(() => {
    // Vérifier si c'est l'heure du Rush (entre 20h et 22h)
    const checkRushHour = () => {
      const currentHour = new Date().getHours();
      setIsRushHour(currentHour >= 20 && currentHour < 22);
    };

    checkRushHour();
    const interval = setInterval(checkRushHour, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, []);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < getMaxSelections(currentLevel)) {
        setSelectedNumbers([...selectedNumbers, number]);
      } else {
        toast.error(`Vous ne pouvez sélectionner que ${getMaxSelections(currentLevel)} numéros à ce niveau`);
      }
    }
  };

  const handlePlay = () => {
    if (selectedNumbers.length !== getMaxSelections(currentLevel)) {
      toast.error(`Veuillez sélectionner ${getMaxSelections(currentLevel)} numéros`);
      return;
    }

    // Simuler un tirage
    const winningNumbers = generateWinningNumbers(currentLevel);
    const matches = selectedNumbers.filter(n => winningNumbers.includes(n)).length;
    
    if (matches === getMaxSelections(currentLevel)) {
      const gain = getLevelPrize(currentLevel) * (isRushHour ? 2 : 1);
      setCurrentGains(currentGains + gain);
      toast.success(`Félicitations ! Vous avez gagné ${gain} CAD$`);
      
      // Proposer de continuer ou de sécuriser les gains
      if (currentLevel < 7) {
        handleNextLevel();
      } else {
        toast.success("Félicitations ! Vous avez atteint le niveau maximum !");
      }
    } else {
      toast.error("Désolé, essayez encore !");
    }
  };

  const handleNextLevel = () => {
    setCurrentLevel(prev => Math.min(prev + 1, 7));
    setSelectedNumbers([]);
  };

  const handleSecureGains = () => {
    toast.success(`Vous avez sécurisé ${currentGains / 2} CAD$`);
    // Implémenter la logique de sécurisation des gains
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de jeu */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold">Niveau {currentLevel}</h2>
            <p className="text-muted-foreground">
              {getLevelName(currentLevel)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isRushHour && (
            <div className="flex items-center gap-2 text-yellow-500">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Rush Hour x2</span>
            </div>
          )}
          <div className="text-right">
            <p className="font-semibold">Gains actuels</p>
            <p className="text-xl font-bold text-green-500">
              {currentGains} CAD$
            </p>
          </div>
        </div>
      </div>

      {/* Affichage du niveau actuel */}
      <PyramidLevel
        level={currentLevel}
        maxNumbers={getMaxNumbers(currentLevel)}
        selectedNumbers={selectedNumbers}
        onNumberSelect={handleNumberSelect}
      />

      {/* Actions disponibles */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={handleSecureGains}
          className="w-full"
        >
          Sécuriser 50% des gains
        </Button>
        <Button 
          onClick={handlePlay}
          className="w-full"
          disabled={selectedNumbers.length !== getMaxSelections(currentLevel)}
        >
          Jouer
        </Button>
      </div>

      {/* Informations du niveau */}
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-1" />
          <div className="space-y-2">
            <p className="font-medium">Instructions du niveau</p>
            <p className="text-sm text-muted-foreground">
              {getLevelDescription(currentLevel)}
            </p>
            <div className="flex gap-4 text-sm">
              <span>Gain : {getLevelPrize(currentLevel)} CAD$</span>
              <span>Multiplicateur : x{getLevelMultiplier(currentLevel)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Fonctions utilitaires
function getMaxSelections(level: number): number {
  const selections = {
    1: 3,
    2: 2,
    3: 2,
    4: 1,
    5: 1,
    6: 1,
    7: 1
  };
  return selections[level as keyof typeof selections];
}

function getMaxNumbers(level: number): number {
  const numbers = {
    1: 30,
    2: 20,
    3: 25,
    4: 15,
    5: 10,
    6: 5,
    7: 3
  };
  return numbers[level as keyof typeof numbers];
}

function getLevelName(level: number): string {
  const names = {
    1: "BASE",
    2: "BRONZE",
    3: "ARGENT",
    4: "OR",
    5: "PLATINE",
    6: "DIAMANT",
    7: "IMPERIAL"
  };
  return names[level as keyof typeof names];
}

function getLevelPrize(level: number): number {
  const prizes = {
    1: 50,
    2: 200,
    3: 1000,
    4: 5000,
    5: 20000,
    6: 100000,
    7: 1000000
  };
  return prizes[level as keyof typeof prizes];
}

function getLevelMultiplier(level: number): number {
  const multipliers = {
    1: 1,
    2: 2,
    3: 3,
    4: 5,
    5: 10,
    6: 20,
    7: 50
  };
  return multipliers[level as keyof typeof multipliers];
}

function getLevelDescription(level: number): string {
  const descriptions = {
    1: "Sélectionnez 3 numéros parmi 30 disponibles",
    2: "Choisissez 2 numéros parmi 20",
    3: "Sélectionnez 2 numéros parmi 25",
    4: "Choisissez 1 numéro parmi 15",
    5: "Sélectionnez 1 symbole parmi 10",
    6: "Choisissez 1 couleur parmi 5",
    7: "Sélectionnez 1 choix parmi 3"
  };
  return descriptions[level as keyof typeof descriptions];
}

function generateWinningNumbers(level: number): number[] {
  const max = getMaxNumbers(level);
  const count = getMaxSelections(level);
  const numbers: number[] = [];
  
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * max) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  
  return numbers;
}
