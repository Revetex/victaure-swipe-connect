
import { Trophy } from "lucide-react";

export function LotteryHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-[#64B5D9]/10">
          <Trophy className="h-6 w-6 text-[#64B5D9]" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#64B5D9]/90 to-[#64B5D9] bg-clip-text text-transparent">
            Lotosphère
          </h2>
          <p className="text-sm text-white/70">
            Tentez votre chance et gagnez gros !
          </p>
        </div>
      </div>
    </div>
  );
}
