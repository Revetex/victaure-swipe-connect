

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { LotoDraw } from "../types";

interface LastDrawProps {
  draw: LotoDraw;
}

export function LastDraw({ draw }: LastDrawProps) {
  return (
    <div className="relative rounded-lg border border-[#64B5D9]/20 bg-white/5 p-4 overflow-hidden">
      {/* Éléments décoratifs CAD */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#64B5D9]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#64B5D9]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#64B5D9]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#64B5D9]/30" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-2">Dernier tirage</h3>
        <p className="text-sm text-white/70">
          Tirage du {format(new Date(draw.completed_at || draw.created_at), 'PPP', { locale: fr })}
        </p>

        {draw.draw_numbers ? (
          <div className="mt-4">
            <div className="flex gap-2 items-center">
              {draw.draw_numbers.map((number, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative w-10 h-10 rounded-lg flex items-center justify-center font-bold bg-[#64B5D9]/20 text-[#64B5D9] border border-[#64B5D9]/50"
                >
                  {number}
                </motion.div>
              ))}
              
              {draw.bonus_color && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="relative ml-2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: draw.bonus_color }}
                >
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              Les résultats du dernier tirage ne sont pas encore disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

