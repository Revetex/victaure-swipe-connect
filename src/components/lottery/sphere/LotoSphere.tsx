import { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Diamond, Crown, Gift } from "lucide-react";
import { toast } from "sonner";
import { PaymentProps } from "@/types/payment";
import { useIsMobile } from "@/hooks/use-mobile";
export function LotoSphere({
  onPaymentRequested
}: PaymentProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const isMobile = useIsMobile();
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
  const colors = [{
    name: "Rouge",
    class: "bg-red-500"
  }, {
    name: "Vert",
    class: "bg-green-500"
  }, {
    name: "Bleu",
    class: "bg-blue-500"
  }, {
    name: "Jaune",
    class: "bg-yellow-500"
  }, {
    name: "Violet",
    class: "bg-purple-500"
  }];
  return <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">LotoSphere</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Cagnotte actuelle:  755 000 CAD$</p>
        </div>
        <Badge variant="outline" className="text-yellow-500 text-xs sm:text-sm">
          <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Prochain tirage: 21h00
        </Badge>
      </div>

      <Card className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Sélectionnez vos 5 numéros</h3>
        <motion.div className={`grid ${isMobile ? 'grid-cols-7 gap-1' : 'grid-cols-10 gap-2'}`}>
          {Array.from({
          length: 50
        }, (_, i) => i + 1).map(number => <Button key={number} variant={selectedNumbers.includes(number) ? "default" : "outline"} onClick={() => handleNumberSelect(number)} className={`${isMobile ? 'h-8 w-8 text-xs' : 'h-10 w-10'} p-0`}>
              {number}
            </Button>)}
        </motion.div>
      </Card>

      <Card className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Choisissez votre couleur bonus</h3>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {colors.map(color => <Button key={color.name} variant="outline" onClick={() => handleColorSelect(color.name)} className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary' : ''} ${color.class}`} />)}
        </div>
      </Card>

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
        
        <Card className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Événements en cours
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>Lundi Magique: -50% sur les tickets</li>
            <li>Mercredi: Gains ×2</li>
            
            
          </ul>
        </Card>
      </div>

      <Button onClick={handlePlay} className="w-full" size={isMobile ? "sm" : "default"} disabled={selectedNumbers.length !== 5 || !selectedColor}>
        Valider mon ticket (5 CAD$)
      </Button>
    </div>;
}