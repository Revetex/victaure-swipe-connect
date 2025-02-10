
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Crown, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        "p-4 sm:p-6 rounded-xl bg-[#1A1F2C]/40 backdrop-blur border border-white/5 shadow-xl"
      )}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className={cn(
            "bg-white/5 transition-colors",
            isMobile ? "w-32" : "w-[180px]"
          )}>
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
          className="shrink-0 h-10 w-10 bg-white/5 hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <motion.div 
        className="flex items-center gap-3 text-sm sm:text-base font-medium"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        {gameOver ? (
          <div className="flex items-center gap-2 text-yellow-400">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">
              {isWhiteTurn ? "Les noirs gagnent!" : "Les blancs gagnent!"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {isThinking ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Brain className="h-5 w-5 animate-pulse" />
                <span>L'IA réfléchit...</span>
              </div>
            ) : (
              <span className="font-semibold">
                Tour des {isWhiteTurn ? "blancs" : "noirs"}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
