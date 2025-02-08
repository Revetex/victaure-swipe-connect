
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
        className="max-w-5xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sword className="h-6 w-6 text-primary" />
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
                  className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl"
                >
                  <div className="text-center p-6 rounded-xl bg-primary/5 border shadow-lg">
                    <Crown className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h2 className="text-2xl font-bold mb-2">
                      {isWhiteTurn ? "Black Wins!" : "White Wins!"}
                    </h2>
                    <button
                      onClick={resetGame}
                      className="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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

          <div className="lg:w-64 space-y-6">
            <div className="p-4 rounded-xl bg-muted/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Move History
              </h2>
              <ChessMoveHistory moveHistory={moveHistory} />
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h2 className="text-lg font-semibold mb-4">Friends Online</h2>
              <ChessFriendsList />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
