
import { Trophy, Clock } from "lucide-react";
import { levels } from "../utils";

interface PyramidHeaderProps {
  currentLevel: number;
  currentGains: number;
  isRushHour: boolean;
}

export function PyramidHeader({ currentLevel, currentGains, isRushHour }: PyramidHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h2 className="text-2xl font-bold">Niveau {currentLevel}</h2>
          <p className="text-muted-foreground">
            {levels[currentLevel].name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isRushHour && (
          <div className="flex items-center gap-2 text-yellow-500">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Rush Hour x2</span>
          </div>
        )}
        <div className="text-right">
          <p className="font-semibold">Gains actuels</p>
          <p className="text-xl font-bold text-green-500">
            {currentGains} CAD$
          </p>
        </div>
      </div>
    </div>
  );
}
