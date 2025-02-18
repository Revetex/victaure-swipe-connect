
import { motion } from "framer-motion";
import { Sword, Crown, Brain } from "lucide-react";
import { ChessBoard } from "./chess/ChessBoard";
import { ChessControls } from "./chess/ChessControls";
import { useChessGame } from "@/hooks/chess/useChessGame";
import { cn } from "@/lib/utils";

export function ChessPage() {
  const {
    board,
    selectedPiece,
    isWhiteTurn,
    isThinking,
    gameOver,
    possibleMoves,
    difficulty,
    handleSquareClick,
    resetGame,
    setDifficulty,
  } = useChessGame();

  return (
    <div className="container mx-auto p-4 md:pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <Sword className="h-5 w-5 text-yellow-400" />
            </div>
            <h1 className="text-lg md:text-xl font-bold">Échecs vs IA</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">IA</span>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <ChessControls
            isThinking={isThinking}
            isWhiteTurn={isWhiteTurn}
            gameOver={gameOver}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onReset={resetGame}
          />
          
          <div className="relative bg-gradient-to-br from-background to-background/95 rounded-lg p-2 md:p-4">
            {gameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm rounded-xl"
              >
                <motion.div 
                  initial={{ y: -20 }}
                  animate={{ 
                    y: [0, -10, 0],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className={cn(
                    "text-center p-4 md:p-6 rounded-xl border shadow-2xl",
                    "bg-gradient-to-br from-[#1A1F2C]/90 to-[#2A2A2A]/90",
                    "border-white/10"
                  )}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <Crown className={cn(
                      "h-12 w-12 mx-auto mb-4",
                      isWhiteTurn ? "text-yellow-400" : "text-violet-400"
                    )} />
                  </motion.div>
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold mb-2"
                    animate={{
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {isWhiteTurn ? (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        Victoire ! Les blancs gagnent ! 🎉
                      </span>
                    ) : (
                      "Les noirs gagnent !"
                    )}
                  </motion.h2>
                  <button
                    onClick={resetGame}
                    className={cn(
                      "mt-4 px-6 py-2 rounded-lg transition-colors",
                      "bg-gradient-to-r",
                      isWhiteTurn 
                        ? "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" 
                        : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700",
                      "text-white font-semibold shadow-lg"
                    )}
                  >
                    Nouvelle partie
                  </button>
                </motion.div>
              </motion.div>
            )}
            
            <ChessBoard
              board={board}
              selectedPiece={selectedPiece}
              possibleMoves={possibleMoves}
              isThinking={isThinking}
              gameOver={gameOver}
              isWhiteTurn={isWhiteTurn}
              onSquareClick={handleSquareClick}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
