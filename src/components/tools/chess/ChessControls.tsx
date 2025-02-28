
import { motion } from "framer-motion";
import { Repeat, SkipForward, Settings, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChessControlsProps {
  isThinking: boolean;
  isWhiteTurn: boolean;
  gameOver: boolean;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
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
  const difficulties = [
    { value: "easy", label: "Facile" },
    { value: "medium", label: "Moyen" },
    { value: "hard", label: "Difficile" }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1A1F2C] rounded-lg p-4 border border-white/5 shadow-md">
      <div className="flex items-center gap-3">
        <div 
          className={cn(
            "w-4 h-4 rounded-full",
            isWhiteTurn ? "bg-white" : "bg-black",
            "shadow-sm"
          )}
        />
        <span className="text-white/80 text-sm">
          {isThinking 
            ? "L'IA réfléchit..." 
            : isWhiteTurn 
              ? "À votre tour" 
              : "Tour de l'IA"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-white/80">Difficulté:</span>
        </div>
        <div className="flex bg-[#0f1218] rounded-md overflow-hidden p-0.5">
          {difficulties.map((option) => (
            <button
              key={option.value}
              className={cn(
                "px-3 py-1 text-xs transition-colors",
                difficulty === option.value
                  ? "bg-violet-500/90 text-white font-medium"
                  : "text-white/70 hover:bg-violet-500/20"
              )}
              onClick={() => onDifficultyChange(option.value)}
              disabled={isThinking}
            >
              {option.label}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-md transition-colors"
          onClick={onReset}
          disabled={isThinking}
        >
          <Repeat className="h-4 w-4" />
          <span className="text-sm font-medium">Nouvelle partie</span>
        </motion.button>
      </div>
    </div>
  );
}
