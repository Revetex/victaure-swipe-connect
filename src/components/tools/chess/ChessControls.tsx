import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Crown } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-muted/50 rounded-xl shadow-md"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={onReset}
          className="shrink-0 h-10 w-10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <motion.div 
        className="flex items-center gap-2 text-sm sm:text-base font-medium"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        {gameOver ? (
          <div className="flex items-center gap-2 text-primary">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">
              {isWhiteTurn ? "Black wins!" : "White wins!"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {isThinking ? (
              <span className="text-muted-foreground">AI is thinking...</span>
            ) : (
              <span className="font-semibold">
                {isWhiteTurn ? "White" : "Black"}'s turn
              </span>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}