

import { LotoDraw } from "../types";

interface PrizePoolProps {
  draw: LotoDraw;
}

export function PrizePool({ draw }: PrizePoolProps) {
  return (
    <div className="relative rounded-lg border border-[#64B5D9]/20 bg-white/5 p-4 overflow-hidden">
      {/* Éléments décoratifs CAD */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#64B5D9]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#64B5D9]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#64B5D9]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#64B5D9]/30" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-2">Cagnotte actuelle</h3>
        <p className="text-3xl font-bold text-[#64B5D9]">
          {draw.prize_pool.toFixed(2)} CAD$
        </p>
        <p className="text-sm text-white/70 mt-1">
          La cagnotte augmente à chaque ticket acheté !
        </p>
      </div>
    </div>
  );
}

