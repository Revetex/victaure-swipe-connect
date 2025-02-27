
import { Button } from "@/components/ui/button";
import { CompassIcon, RefreshCw, Swords } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  onReset
}: ChessControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-lg border border-border/50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            Tour : {isWhiteTurn ? "Blancs" : "Noirs"}
          </span>
        </div>
        
        <div className="h-4 w-px bg-border/50" />
        
        <Select value={difficulty} onValueChange={onDifficultyChange} disabled={isThinking}>
          <SelectTrigger className="w-32 bg-background/50">
            <SelectValue placeholder="Difficulté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Facile</SelectItem>
            <SelectItem value="medium">Moyen</SelectItem>
            <SelectItem value="hard">Difficile</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset} 
        disabled={isThinking}
        className="ml-auto bg-background/50 hover:bg-background/80"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Nouvelle partie
      </Button>
    </div>
  );
}
