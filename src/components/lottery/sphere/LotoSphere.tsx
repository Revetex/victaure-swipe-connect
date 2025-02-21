
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Diamond, Crown, Gift, Clock, Ticket, History } from "lucide-react";
import { toast } from "sonner";
import { PaymentProps } from "@/types/payment";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLotoSphere } from "@/hooks/useLotoSphere";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LotoHistory } from "./LotoHistory";

export function LotoSphere({
  onPaymentRequested
}: PaymentProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const {
    currentDraw,
    myTickets,
    numberStats,
    isLoading,
    buyTicket
  } = useLotoSphere();

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

  const handlePlay = async () => {
    if (selectedNumbers.length !== 5 || !selectedColor) {
      toast.error("Veuillez sélectionner 5 numéros et une couleur");
      return;
    }

    try {
      await buyTicket({ numbers: selectedNumbers, color: selectedColor });
      setSelectedNumbers([]);
      setSelectedColor(null);
    } catch (error) {
      toast.error("Erreur lors de l'achat du ticket");
    }
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

  if (isLoading || !currentDraw) {
    return <div>Chargement...</div>;
  }

  const nextDrawTime = new Date(currentDraw.scheduled_for);
  const formattedNextDraw = format(nextDrawTime, "PPp", { locale: fr });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">LotoSphere</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Cagnotte actuelle: {currentDraw.prize_pool.toLocaleString()} CAD$
          </p>
        </div>
        <Badge variant="outline" className="text-yellow-500 text-xs sm:text-sm">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Prochain tirage: {formattedNextDraw}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
            Mes tickets pour ce tirage ({myTickets.length})
          </h3>
          <ScrollArea className="h-[150px] sm:h-[200px]">
            <div className="space-y-2">
              {myTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
                  <div className="flex items-center space-x-2">
                    <Ticket className="h-4 w-4" />
                    <span className="text-sm">{ticket.selected_numbers.join(", ")}</span>
                  </div>
                  <Badge className={`${colors.find(c => c.name.toLowerCase() === ticket.bonus_color.toLowerCase())?.class}`}>
                    {ticket.bonus_color}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
            Statistiques des numéros
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {Object.values(numberStats).slice(0, 10).map((stat: any) => (
              <Badge key={stat.number} variant="outline" className="text-center">
                {stat.number}
                <span className="text-xs ml-1">({stat.times_drawn})</span>
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
          Sélectionnez vos 5 numéros
        </h3>
        <motion.div className={`grid ${isMobile ? 'grid-cols-7 gap-1' : 'grid-cols-10 gap-2'}`}>
          {Array.from({ length: 50 }, (_, i) => i + 1).map(number => (
            <Button 
              key={number}
              variant={selectedNumbers.includes(number) ? "default" : "outline"}
              onClick={() => handleNumberSelect(number)}
              className={`
                relative 
                ${isMobile ? 'h-8 w-8 text-xs' : 'h-10 w-10'}
                ${numberStats[number]?.times_drawn > 0 ? 'border-yellow-500/50' : ''}
                p-0
              `}
            >
              {number}
              {numberStats[number]?.times_drawn > 0 && (
                <motion.div 
                  className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </Button>
          ))}
        </motion.div>
      </Card>

      <Card className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
          Choisissez votre couleur bonus
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {colors.map(color => (
            <Button
              key={color.name}
              variant="outline"
              onClick={() => handleColorSelect(color.name)}
              className={`
                ${isMobile ? 'h-10 w-10' : 'h-12 w-12'}
                rounded-full
                ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary' : ''}
                ${color.class}
              `}
            />
          ))}
        </div>
      </Card>

      <LotoHistory />

      <Button
        onClick={handlePlay}
        className="w-full"
        size={isMobile ? "sm" : "default"}
        disabled={selectedNumbers.length !== 5 || !selectedColor}
      >
        Valider mon ticket (5 CAD$)
      </Button>
    </div>
  );
}
