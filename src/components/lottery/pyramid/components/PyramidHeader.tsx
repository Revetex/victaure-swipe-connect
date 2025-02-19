
import { Trophy, Clock } from "lucide-react";
import { levels } from "../utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PyramidHeaderProps {
  currentLevel: number;
  currentGains: number;
  isRushHour: boolean;
}

export function PyramidHeader({ currentLevel, currentGains, isRushHour }: PyramidHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <Trophy className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-yellow-500`} />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Niveau {currentLevel}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {levels[currentLevel].name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isRushHour && (
          <div className="flex items-center gap-2 text-yellow-500">
            <Clock className="h-5 w-5" />
            <span className="font-semibold text-sm sm:text-base">Rush Hour x2</span>
          </div>
        )}
        <div className="text-right">
          <p className="font-semibold text-sm sm:text-base">Gains actuels</p>
          <p className="text-lg sm:text-xl font-bold text-green-500">
            {currentGains} CAD$
          </p>
        </div>
      </div>
    </div>
  );
}
