
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { levels } from "../utils";

interface LevelInfoProps {
  currentLevel: number;
}

export function LevelInfo({ currentLevel }: LevelInfoProps) {
  const level = levels[currentLevel];

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex items-start gap-3 sm:gap-4">
        <AlertCircle className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="space-y-2">
          <p className="font-medium text-sm sm:text-base">Instructions du niveau</p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {level.description}
          </p>
          <div className="flex gap-4 text-xs sm:text-sm">
            <span>Gain : {level.prize} CAD$</span>
            <span>Multiplicateur : x{level.multiplier}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
