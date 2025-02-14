
import { Button } from "@/components/ui/button";
import { CompassIcon, RefreshCw, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChessControlsProps {
  isThinking: boolean;
  isWhiteTurn: boolean;
  gameOver: boolean;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  onReset: () => void;
}

export function ChessControls({
  isThinking,
  isWhiteTurn,
  gameOver,
  difficulty,
  onDifficultyChange,
  onReset,
}: ChessControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-lg border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CompassIcon className="h-4 w-4" />
          <span className="text-sm font-medium">
            Tour : {isWhiteTurn ? "Blancs" : "Noirs"}
          </span>
        </div>
        
        <div className="h-4 w-px bg-border" />
        
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <Select
            value={difficulty}
            onValueChange={onDifficultyChange}
            disabled={isThinking}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Facile</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="hard">Difficile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={isThinking}
        className="ml-auto"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Nouvelle partie
      </Button>
    </div>
  );
}
