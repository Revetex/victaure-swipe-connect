
import { LotoDraw } from "../types";

interface PrizePoolProps {
  draw: LotoDraw;
}

export function PrizePool({ draw }: PrizePoolProps) {
  return (
    <div className="rounded-lg border border-[#64B5D9]/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold mb-2">Cagnotte actuelle</h3>
      <p className="text-3xl font-bold text-[#64B5D9]">
        {draw.prize_pool.toFixed(2)}€
      </p>
      <p className="text-sm text-white/70 mt-1">
        La cagnotte augmente à chaque ticket acheté !
      </p>
    </div>
  );
}
