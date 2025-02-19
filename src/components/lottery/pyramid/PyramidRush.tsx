
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { levels, generateWinningNumbers } from "./utils";
import { PyramidHeader } from "./components/PyramidHeader";
import { LevelInfo } from "./components/LevelInfo";
import { PyramidActions } from "./components/PyramidActions";
import { PaymentProps } from "@/types/payment";
import { useIsMobile } from "@/hooks/use-mobile";

export function PyramidRush({ onPaymentRequested }: PaymentProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [currentGains, setCurrentGains] = useState(0);
  const [isRushHour, setIsRushHour] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkRushHour = () => {
      const currentHour = new Date().getHours();
      setIsRushHour(currentHour >= 20 && currentHour < 22);
    };

    checkRushHour();
    const interval = setInterval(checkRushHour, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < levels[currentLevel].maxSelections) {
        setSelectedNumbers([...selectedNumbers, number]);
      } else {
        toast.error(`Vous ne pouvez sélectionner que ${levels[currentLevel].maxSelections} numéros à ce niveau`);
      }
    }
  };

  const handlePlay = () => {
    if (selectedNumbers.length !== levels[currentLevel].maxSelections) {
      toast.error(`Veuillez sélectionner ${levels[currentLevel].maxSelections} numéros`);
      return;
    }

    const winningNumbers = generateWinningNumbers(currentLevel);
    const matches = selectedNumbers.filter(n => winningNumbers.includes(n)).length;
    
    if (matches === levels[currentLevel].maxSelections) {
      const gain = levels[currentLevel].prize * (isRushHour ? 2 : 1);
      setCurrentGains(currentGains + gain);
      toast.success(`Félicitations ! Vous avez gagné ${gain} CAD$`);
      
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
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PyramidHeader
        currentLevel={currentLevel}
        currentGains={currentGains}
        isRushHour={isRushHour}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`grid ${isMobile ? 'grid-cols-4 gap-2' : 'grid-cols-5 gap-4'}`}
      >
        {Array.from({ length: levels[currentLevel].maxNumbers }, (_, i) => i + 1).map((number) => (
          <Button
            key={number}
            variant={selectedNumbers.includes(number) ? "default" : "outline"}
            onClick={() => handleNumberSelect(number)}
            className={`${isMobile ? 'h-10 w-10 p-0 text-sm' : 'h-12 w-12 p-0'} font-semibold`}
          >
            {number}
          </Button>
        ))}
      </motion.div>

      <PyramidActions
        onSecureGains={handleSecureGains}
        onPlay={handlePlay}
        isPlayDisabled={selectedNumbers.length !== levels[currentLevel].maxSelections}
        isMobile={isMobile}
      />

      <LevelInfo currentLevel={currentLevel} />
    </div>
  );
}
