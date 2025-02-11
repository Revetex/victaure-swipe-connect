
import { motion } from "framer-motion";
import { Sword, Crown, Brain } from "lucide-react";
import { ChessBoard } from "./chess/ChessBoard";
import { ChessControls } from "./chess/ChessControls";
import { useChessGame } from "@/hooks/chess/useChessGame";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-[#1e293b]/50 to-[#0f172a]/50 backdrop-blur-sm border border-white/10 overflow-hidden"
      >
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
              >
                <Sword className="h-6 w-6 text-yellow-400" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                Échecs vs IA
              </h1>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
            >
              <Brain className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-200/80">IA</span>
            </motion.div>
          </motion.div>

          {/* Game Area */}
          <div className="space-y-6 md:space-y-8">
            <ChessControls
              isThinking={isThinking}
              isWhiteTurn={isWhiteTurn}
              gameOver={gameOver}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onReset={resetGame}
            />
            
            <div className="relative">
              {gameOver && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md rounded-2xl"
                >
                  <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 border border-white/10 shadow-2xl">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                      {isWhiteTurn ? "Les noirs gagnent!" : "Les blancs gagnent!"}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetGame}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 
                               text-yellow-200 font-medium transition-colors border border-white/10"
                    >
                      Nouvelle partie
                    </motion.button>
                  </div>
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
        </div>
      </motion.div>
    </div>
  );
}
