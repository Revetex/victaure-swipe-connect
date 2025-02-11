
import { motion } from "framer-motion";
import { Sword, Crown, Brain, AlertCircle } from "lucide-react";
import { ChessBoard } from "./chess/ChessBoard";
import { ChessControls } from "./chess/ChessControls";
import { useChessGame } from "@/hooks/chess/useChessGame";
import { useIsMobile } from "@/hooks/use-mobile";
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
    gameStatus,
    handleSquareClick,
    resetGame,
    setDifficulty,
  } = useChessGame();

  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <Sword className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
              Échecs vs IA
            </h1>
            <p className="text-sm text-yellow-200/60">
              {isWhiteTurn ? "À vous de jouer" : "L'IA réfléchit..."}
            </p>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10",
          gameStatus.isCheck ? "bg-red-500/20 animate-pulse" : "bg-white/5"
        )}>
          {gameStatus.isCheck ? (
            <>
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-200">Échec !</span>
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-200/80">Mode {difficulty}</span>
            </>
          )}
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
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md rounded-2xl">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10 shadow-2xl"
              >
                <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                  {gameStatus.reason}
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
              </motion.div>
            </div>
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
  );
}
