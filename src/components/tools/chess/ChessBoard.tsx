import { motion } from "framer-motion";
import { ChessPiece } from "./types";

interface ChessBoardProps {
  board: (ChessPiece | null)[][];
  selectedPiece: { row: number; col: number } | null;
  possibleMoves: { row: number; col: number }[];
  isThinking: boolean;
  gameOver: boolean;
  isWhiteTurn: boolean;
  onSquareClick: (row: number, col: number) => void;
}

export function ChessBoard({
  board,
  selectedPiece,
  possibleMoves,
  isThinking,
  gameOver,
  isWhiteTurn,
  onSquareClick,
}: ChessBoardProps) {
  const getPieceSymbol = (piece: ChessPiece | null) => {
    if (!piece) return null;
    
    const symbols: Record<string, Record<string, string>> = {
      pawn: { true: '♙', false: '♟' },
      rook: { true: '♖', false: '♜' },
      knight: { true: '♘', false: '♞' },
      bishop: { true: '♗', false: '♝' },
      queen: { true: '♕', false: '♛' },
      king: { true: '♔', false: '♚' }
    };

    return symbols[piece.type][piece.isWhite.toString()];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[500px] mx-auto mb-4"
    >
      <div className="grid grid-cols-8 gap-0.5 border border-border rounded-lg overflow-hidden shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
            const isLight = (rowIndex + colIndex) % 2 === 0;
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                disabled={isThinking || (gameOver && !isWhiteTurn)}
                className={`
                  aspect-square flex items-center justify-center text-2xl sm:text-3xl relative
                  ${isLight ? 'bg-light-purple/20' : 'bg-dark-purple/20'}
                  ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
                  ${isPossibleMove ? 'after:absolute after:inset-2 after:rounded-full after:bg-primary/20 after:animate-pulse' : ''}
                  hover:bg-primary/20 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  touch-manipulation
                `}
              >
                <motion.span
                  initial={false}
                  animate={{ 
                    scale: piece ? 1 : 0.8,
                    opacity: piece ? 1 : 0 
                  }}
                  className="relative z-10"
                >
                  {getPieceSymbol(piece)}
                </motion.span>
              </motion.button>
            );
          })
        ))}
      </div>
    </motion.div>
  );
}