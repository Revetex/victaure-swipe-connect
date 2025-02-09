
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
    <div className="container mx-auto p-2">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto rounded-lg border bg-background/50 backdrop-blur p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/5">
              <Sword className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold">Chess vs AI</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Brain className="h-3 w-3" />
            <span>AI</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-4">
          <div className="space-y-4">
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
                  <div className="text-center p-4 rounded-xl bg-background/90 border shadow-lg">
                    <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isWhiteTurn ? "Black Wins!" : "White Wins!"}
                    </h3>
                    <button
                      onClick={resetGame}
                      className="mt-2 px-4 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm"
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

          <div className="lg:w-56 space-y-4">
            <div className="p-3 rounded-lg bg-background/50 border">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-yellow-400" />
                Move History
              </h3>
              <ChessMoveHistory moveHistory={moveHistory} />
            </div>

            <div className="p-3 rounded-lg bg-background/50 border">
              <h3 className="text-sm font-medium mb-2">Friends Online</h3>
              <ChessFriendsList />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
