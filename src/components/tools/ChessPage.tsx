
import { motion } from "framer-motion";
import { Sword, Crown, Brain } from "lucide-react";
import { ChessBoard } from "./chess/ChessBoard";
import { ChessControls } from "./chess/ChessControls";
import { ChessMoveHistory } from "./chess/ChessMoveHistory";
import { useChessGame } from "./chess/useChessGame";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function ChessPage() {
  const isMobile = useIsMobile();
  const {
    board,
    selectedPiece,
    isWhiteTurn,
    isThinking,
    gameOver,
    moveHistory,
    possibleMoves,
    difficulty,
    handleSquareClick,
    resetGame,
    setDifficulty,
  } = useChessGame();

  return (
    <div className={cn(
      "container mx-auto p-4",
      "min-h-[calc(100vh-4rem)]",
      "flex flex-col"
    )}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex-1",
          "max-w-5xl mx-auto rounded-xl",
          "border border-white/10 bg-[#221F26]/40 backdrop-blur",
          "p-4 sm:p-8 shadow-2xl"
        )}
      >
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <Sword className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Échecs vs IA</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Propulsé par l'IA</span>
          </div>
        </div>

        <div className={cn(
          "grid gap-6 sm:gap-8",
          isMobile ? "grid-cols-1" : "lg:grid-cols-[1fr_auto]"
        )}>
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
                  <div className="text-center p-6 sm:p-8 rounded-xl bg-[#1A1F2C]/90 border border-white/10 shadow-2xl">
                    <Crown className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-yellow-400" />
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
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

          {!isMobile && (
            <div className="lg:w-72 space-y-6">
              <div className="p-6 rounded-xl bg-[#1A1F2C]/40 border border-white/5">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Historique
                </h2>
                <ChessMoveHistory moveHistory={moveHistory} />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
