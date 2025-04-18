
import { ChessPiece } from "@/types/chess";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  onSquareClick,
}: ChessBoardProps) {
  const pieceToSymbol = (piece: ChessPiece | null) => {
    if (!piece) return "";
    const symbols: Record<string, string> = {
      king: piece.isWhite ? "♔" : "♚",
      queen: piece.isWhite ? "♕" : "♛",
      rook: piece.isWhite ? "♖" : "♜",
      bishop: piece.isWhite ? "♗" : "♝",
      knight: piece.isWhite ? "♘" : "♞",
      pawn: piece.isWhite ? "♙" : "♟"
    };
    return symbols[piece.type];
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-square w-full">
        <div className="grid grid-cols-8 h-full w-full rounded-lg overflow-hidden border shadow-xl bg-neutral-100 dark:bg-neutral-900">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
              const isPossibleMove = possibleMoves.some(
                move => move.row === rowIndex && move.col === colIndex
              );
              const isLight = (rowIndex + colIndex) % 2 === 0;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "relative w-full aspect-square",
                    "flex items-center justify-center",
                    isLight 
                      ? "bg-white dark:bg-neutral-800" 
                      : "bg-neutral-300 dark:bg-neutral-700",
                    isSelected && "ring-2 ring-yellow-400 ring-inset z-10",
                    !gameOver && !isThinking && "cursor-pointer hover:brightness-90 active:brightness-95",
                    gameOver && "cursor-not-allowed opacity-50"
                  )}
                  onClick={() => !gameOver && !isThinking && onSquareClick(rowIndex, colIndex)}
                >
                  {isPossibleMove && (
                    <motion.div
                      className="absolute inset-2 rounded-full bg-yellow-400/20 border-2 border-yellow-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    />
                  )}
                  
                  {piece && (
                    <span
                      className={cn(
                        "text-2xl sm:text-3xl md:text-4xl lg:text-5xl select-none",
                        piece.isWhite ? "text-black dark:text-white" : "text-neutral-800 dark:text-neutral-300"
                      )}
                    >
                      {pieceToSymbol(piece)}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
