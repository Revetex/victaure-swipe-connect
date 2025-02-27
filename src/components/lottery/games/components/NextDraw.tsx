
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { LotoDraw } from "../types";

interface NextDrawProps {
  draw: LotoDraw;
  onPaymentRequested: (amount: number, description: string) => void;
}

export function NextDraw({ draw, onPaymentRequested }: NextDrawProps) {
  const formatTimeToNext = (scheduledFor: string) => {
    return formatDistanceToNow(new Date(scheduledFor), {
      locale: fr,
      addSuffix: true
    });
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
        <div className="mt-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-[#64B5D9] rounded-lg transition-colors relative overflow-hidden group"
          >
            <span className="relative z-10">Acheter un ticket (5 €)</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
