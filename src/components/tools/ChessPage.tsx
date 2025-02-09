
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
        className="max-w-5xl mx-auto rounded-lg border bg-gradient-to-br from-background/95 to-background/50 backdrop-blur p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sword className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Échecs vs IA</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span>Intelligence Artificielle</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-6">
          <div className="space-y-6">
            <ChessControls
              isThinking={isThinking}
              isWhiteTurn={isWhiteTurn}
              gameOver={gameOver}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onReset={resetGame}
            />
            
            <div className="relative rounded-lg overflow-hidden border bg-background/50">
              {gameOver && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm"
                >
                  <div className="text-center p-6 rounded-xl bg-background/90 border shadow-lg">
                    <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                    <h3 className="text-2xl font-semibold mb-4">
                      {isWhiteTurn ? "Les noirs gagnent !" : "Les blancs gagnent !"}
                    </h3>
                    <button
                      onClick={resetGame}
                      className="px-6 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
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

          <div className="lg:w-72 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-lg bg-background/50 border"
            >
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-400" />
                Historique des coups
              </h3>
              <ChessMoveHistory moveHistory={moveHistory} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-background/50 border"
            >
              <h3 className="text-sm font-medium mb-4">Amis en ligne</h3>
              <ChessFriendsList />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
