
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-white/5">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-36 bg-white/5">
            <SelectValue placeholder="Difficulté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Facile</SelectItem>
            <SelectItem value="medium">Moyen</SelectItem>
            <SelectItem value="hard">Difficile</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-10 w-10 bg-white/5"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <motion.div 
        className="text-sm font-medium"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        {isThinking ? (
          <span className="text-muted-foreground">L'IA réfléchit...</span>
        ) : (
          <span>Tour des {isWhiteTurn ? "blancs" : "noirs"}</span>
        )}
      </motion.div>
    </div>
  );
}
