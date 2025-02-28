

import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { LotoDraw } from "../types";
import { useState } from "react";

interface NextDrawProps {
  draw: LotoDraw;
  onPaymentRequested: (amount: number, description: string) => void;
}

export function NextDraw({ draw, onPaymentRequested }: NextDrawProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const availableColors = [
    { name: "Rouge", value: "#FF4444" },
    { name: "Vert", value: "#44FF44" },
    { name: "Bleu", value: "#4444FF" },
    { name: "Jaune", value: "#FFFF44" },
  ];

  const formatTimeToNext = (scheduledFor: string) => {
    return formatDistanceToNow(new Date(scheduledFor), {
      locale: fr,
      addSuffix: true
    });
  };

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  return (
    <div className="relative rounded-lg border border-[#64B5D9]/20 bg-white/5 p-4 overflow-hidden">
      {/* Éléments décoratifs CAD */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#64B5D9]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#64B5D9]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#64B5D9]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#64B5D9]/30" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-2">Prochain tirage</h3>
        <p className="text-sm text-white/70">
          Le prochain tirage aura lieu {formatTimeToNext(draw.scheduled_for)}
        </p>
        <p className="text-sm text-[#64B5D9] mt-1">
          {format(new Date(draw.scheduled_for), 'PPP à HH:mm', { locale: fr })}
        </p>

        {/* Sélection des numéros */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Sélectionnez 5 numéros</p>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => i + 1).map((number) => (
              <motion.button
                key={number}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberSelect(number)}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors
                  ${selectedNumbers.includes(number) 
                    ? 'bg-[#64B5D9]/30 text-[#64B5D9] border-[#64B5D9]' 
                    : 'bg-white/5 text-white/70 hover:bg-[#64B5D9]/10'
                  } border border-[#64B5D9]/20`}
              >
                <div className="absolute inset-0 rounded-lg border border-[#64B5D9]/20" />
                {number}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sélection de la couleur */}
        <div className="mt-6">
          <p className="text-sm font-semibold mb-2">Choisissez une couleur bonus</p>
          <div className="flex gap-3">
            {availableColors.map((color) => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(color.value)}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-transform`}
                style={{ 
                  backgroundColor: `${color.value}1a`,
                  border: `1px solid ${selectedColor === color.value ? color.value : `${color.value}30`}`
                }}
              >
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color.value }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bouton d'achat */}
        <div className="mt-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPaymentRequested(5, "Lotosphère")}
            disabled={selectedNumbers.length !== 5 || !selectedColor}
            className={`w-full py-3 px-4 rounded-lg transition-colors relative overflow-hidden group
              ${selectedNumbers.length === 5 && selectedColor 
                ? 'bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-[#64B5D9]' 
                : 'bg-white/5 text-white/50 cursor-not-allowed'
              }`}
          >
            <span className="relative z-10">
              Acheter un ticket (5 CAD$)
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
            </div>
          </motion.button>
        </div>

        {/* État de la sélection */}
        {(selectedNumbers.length > 0 || selectedColor) && (
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-[#64B5D9]/20">
            <p className="text-sm text-white/70">
              Sélection actuelle : {selectedNumbers.join(', ')} 
              {selectedColor && (
                <span className="inline-block w-3 h-3 ml-2 rounded-full"
                  style={{ backgroundColor: selectedColor }} 
                />
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

