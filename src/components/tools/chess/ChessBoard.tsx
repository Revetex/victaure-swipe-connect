
import { cn } from "@/lib/utils";
import { ChessPiece } from "@/types/chess";
import { motion } from "framer-motion";

interface ChessBoardProps {
  board: (ChessPiece | null)[][];
  selectedPiece: { row: number; col: number } | null;
  possibleMoves: { row: number; col: number }[];
  isThinking?: boolean;
  gameOver?: boolean;
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
  onSquareClick 
}: ChessBoardProps) {
  const getPieceIcon = (piece: ChessPiece) => {
    const iconMap = {
      king: piece.isWhite ? "♔" : "♚",
      queen: piece.isWhite ? "♕" : "♛",
      rook: piece.isWhite ? "♖" : "♜",
      bishop: piece.isWhite ? "♗" : "♝",
      knight: piece.isWhite ? "♘" : "♞",
      pawn: piece.isWhite ? "♙" : "♟",
    };
    return iconMap[piece.type];
  };

  return (
    <div className="aspect-square w-full max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-8 gap-1 aspect-square w-full border-2 border-primary/20 rounded-lg bg-white/5 backdrop-blur-sm p-2">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isPossibleMove = possibleMoves.some(
              (move) => move.row === rowIndex && move.col === colIndex
            );
            const isLight = (rowIndex + colIndex) % 2 === 0;

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "aspect-square relative flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-chess transition-colors",
                  "rounded border border-primary/10",
                  isLight ? "bg-white/90" : "bg-primary/20",
                  isSelected && "ring-2 ring-primary ring-offset-2",
                  isPossibleMove && "ring-2 ring-yellow-400",
                  !gameOver && "hover:bg-primary/5",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                disabled={isThinking || gameOver}
              >
                {piece && (
                  <span className={cn(
                    "transition-transform select-none",
                    piece.isWhite 
                      ? "text-zinc 900" 
                      : "text-zinc 900 drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]",
                    isSelected && "scale-110"
                  )}>
                    {getPieceIcon(piece)}
                  </span>
                )}
                {isPossibleMove && !piece && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-2 rounded-full bg-yellow-400/20"
                  />
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
