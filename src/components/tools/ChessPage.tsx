
import { motion } from "framer-motion";
import { Sword, Crown, Brain } from "lucide-react";
import { ChessBoard } from "./chess/ChessBoard";
import { ChessControls } from "./chess/ChessControls";
import { useChessGame } from "@/hooks/chess/useChessGame";

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
    <div className="container mx-auto p-4 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <Sword className="h-5 w-5 text-yellow-400" />
            </div>
            <h1 className="text-xl font-bold">Échecs vs IA</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">IA</span>
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
          
          <div className="relative">
            {gameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm rounded-xl"
              >
                <div className="text-center p-6 rounded-xl bg-[#1A1F2C]/90 border border-white/10 shadow-2xl">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                  <h2 className="text-2xl font-bold mb-2">
                    {isWhiteTurn ? "Les noirs gagnent!" : "Les blancs gagnent!"}
                  </h2>
                  <button
                    onClick={resetGame}
                    className="mt-4 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Nouvelle partie
                  </button>
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
      </motion.div>
    </div>
  );
}
