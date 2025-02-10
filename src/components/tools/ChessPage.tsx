
import { motion } from "framer-motion";
import { Sword, Crown, Brain } from "lucide-react";
import { ChessBoard } from "./chess/ChessBoard";
import { ChessControls } from "./chess/ChessControls";
import { ChessMoveHistory } from "./chess/ChessMoveHistory";
import { ChessFriendsList } from "./chess/ChessFriendsList";
import { useChessGame } from "./chess/useChessGame";

export function ChessPage() {
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
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto rounded-xl border border-white/10 bg-[#221F26]/40 backdrop-blur p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <Sword className="h-6 w-6 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold">Chess vs AI</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span>Powered by AI</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-8">
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
                  <div className="text-center p-8 rounded-xl bg-[#1A1F2C]/90 border border-white/10 shadow-2xl">
                    <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                    <h2 className="text-2xl font-bold mb-2">
                      {isWhiteTurn ? "Black Wins!" : "White Wins!"}
                    </h2>
                    <button
                      onClick={resetGame}
                      className="mt-4 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Play Again
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

          <div className="lg:w-72 space-y-6">
            <div className="p-6 rounded-xl bg-[#1A1F2C]/40 border border-white/5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                Move History
              </h2>
              <ChessMoveHistory moveHistory={moveHistory} />
            </div>

            <div className="p-6 rounded-xl bg-[#1A1F2C]/40 border border-white/5">
              <h2 className="text-lg font-semibold mb-4">Friends Online</h2>
              <ChessFriendsList />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

