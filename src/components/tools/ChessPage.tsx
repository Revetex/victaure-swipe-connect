
import { motion } from "framer-motion";
import { Sword, Crown, Brain, Trophy } from "lucide-react";
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
    <div className="container mx-auto p-4 md:pt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto rounded-xl bg-gradient-to-b from-background/95 to-background/50 backdrop-blur-sm border border-white/10 p-4 md:p-6 space-y-6"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 rounded-lg bg-yellow-500/10">
              <Sword className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                Imperium Chess
              </h1>
              <p className="text-sm text-white/70">
                Affrontez l'IA et devenez un maître
              </p>
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">
              IA Niveau {difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-6">
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
                    "text-center p-6 md:p-8 rounded-xl border-2 shadow-2xl",
                    "bg-gradient-to-br from-[#1A1F2C]/90 to-[#2A2A2A]/90",
                    isWhiteTurn 
                      ? "border-yellow-400/50" 
                      : "border-violet-400/50"
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
                    {isWhiteTurn ? (
                      <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                    ) : (
                      <Crown className="h-16 w-16 mx-auto mb-4 text-violet-400" />
                    )}
                  </motion.div>
                  
                  <motion.h2 
                    className="text-2xl md:text-3xl font-bold mb-4"
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
                      <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                        Les noirs gagnent !
                      </span>
                    )}
                  </motion.h2>
                  
                  <button
                    onClick={resetGame}
                    className={cn(
                      "mt-4 px-8 py-3 rounded-lg transition-all duration-300",
                      "text-white font-semibold shadow-lg",
                      "bg-gradient-to-r",
                      isWhiteTurn 
                        ? "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" 
                        : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700",
                      "transform hover:scale-105 active:scale-95"
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
