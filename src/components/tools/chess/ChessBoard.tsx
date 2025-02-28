
import { motion } from "framer-motion";
import { ChessPiece } from "@/types/chess";
import { cn } from "@/lib/utils";

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
  onSquareClick
}: ChessBoardProps) {
  const pieceIcons: Record<ChessPiece["type"], { white: string; black: string }> = {
    pawn: {
      white: "♙",
      black: "♟"
    },
    rook: {
      white: "♖",
      black: "♜"
    },
    knight: {
      white: "♘",
      black: "♞"
    },
    bishop: {
      white: "♗",
      black: "♝"
    },
    queen: {
      white: "♕",
      black: "♛"
    },
    king: {
      white: "♔",
      black: "♚"
    }
  };

  return (
    <div className="aspect-square w-full max-w-xl mx-auto relative rounded-lg overflow-hidden shadow-lg">
      {isThinking && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center">
            <div className="animate-bounce mb-2">
              <div className="w-12 h-12 rounded-full border-4 border-violet-400 border-t-transparent animate-spin" />
            </div>
            <p className="text-violet-300 text-lg font-medium">IA réfléchit...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-8 grid-rows-8 h-full w-full select-none">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isPossibleMove = possibleMoves.some(
              move => move.row === rowIndex && move.col === colIndex
            );
            const isWhiteSquare = (rowIndex + colIndex) % 2 === 0;

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "aspect-square flex items-center justify-center relative",
                  "text-3xl md:text-4xl cursor-pointer transition-colors",
                  isWhiteSquare ? "bg-amber-100/90" : "bg-amber-800/90",
                  isSelected && "ring-4 ring-yellow-400 z-10",
                  gameOver && "cursor-not-allowed"
                )}
                onClick={() => !gameOver && onSquareClick(rowIndex, colIndex)}
              >
                {isPossibleMove && (
                  <div className={cn(
                    "absolute inset-2 rounded-full opacity-50",
                    piece ? "bg-red-500/60" : "bg-green-500/60"
                  )} />
                )}

                {piece && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "select-none pointer-events-none",
                      "transition-transform",
                      piece.isWhite ? "text-white" : "text-black",
                      isSelected && "scale-110"
                    )}
                  >
                    {piece.isWhite ? pieceIcons[piece.type].white : pieceIcons[piece.type].black}
                  </motion.span>
                )}

                {/* Square coordinate indicators */}
                {rowIndex === 7 && (
                  <div className="absolute bottom-0.5 right-1 text-[8px] md:text-xs font-mono opacity-60">
                    {String.fromCharCode(97 + colIndex)}
                  </div>
                )}
                {colIndex === 0 && (
                  <div className="absolute top-0.5 left-1 text-[8px] md:text-xs font-mono opacity-60">
                    {8 - rowIndex}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
