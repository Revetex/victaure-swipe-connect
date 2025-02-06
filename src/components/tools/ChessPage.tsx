import { motion } from "framer-motion";
import { Sword } from "lucide-react";
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
        className="max-w-2xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-4 sm:p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sword className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-xl sm:text-2xl font-bold">Chess vs AI</h1>
          </div>
        </div>

        <ChessControls
          isThinking={isThinking}
          isWhiteTurn={isWhiteTurn}
          gameOver={gameOver}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onReset={resetGame}
        />
        
        <ChessBoard
          board={board}
          selectedPiece={selectedPiece}
          possibleMoves={possibleMoves}
          isThinking={isThinking}
          gameOver={gameOver}
          isWhiteTurn={isWhiteTurn}
          onSquareClick={handleSquareClick}
        />

        <div className="grid sm:grid-cols-2 gap-6">
          <ChessMoveHistory moveHistory={moveHistory} />

          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold mb-4">Play with Friends</h2>
            <ChessFriendsList />
          </div>
        </div>
      </motion.div>
    </div>
  );
}