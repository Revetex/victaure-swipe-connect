
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
    <div className="relative aspect-square w-full max-w-2xl mx-auto p-4">
      <div className="relative grid grid-cols-8 gap-0.5 aspect-square w-full border-2 border-primary/20 rounded-lg bg-[#2A2A2A] p-2">
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
                layout
                layoutId={`square-${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square relative flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-chess transition-colors",
                  "border border-primary/10",
                  isLight ? "bg-[#E8E8E8]" : "bg-[#8B8B8B]",
                  isSelected && "ring-2 ring-primary ring-offset-2",
                  isPossibleMove && "ring-2 ring-yellow-400",
                  !gameOver && "hover:bg-primary/5",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                disabled={isThinking || gameOver}
              >
                {piece && (
                  <motion.span 
                    layoutId={`piece-${rowIndex}-${colIndex}`}
                    className={cn(
                      "transition-transform select-none",
                      piece.isWhite 
                        ? "text-[#FFFFFF] drop-shadow-[0_0_3px_rgba(0,0,0,0.7)]" 
                        : "text-[#000000] drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]",
                      isSelected && "scale-110"
                    )}
                  >
                    {getPieceIcon(piece)}
                  </motion.span>
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
