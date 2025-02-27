
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
    <div className="rounded-lg border border-[#64B5D9]/10 bg-white/5 p-4">
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
          className="w-full py-2 px-4 bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-[#64B5D9] rounded-lg transition-colors"
          onClick={() => onPaymentRequested(5, "Lotosphère")}
        >
          Acheter un ticket (5 €)
        </motion.button>
      </div>
    </div>
  );
}
