
import { motion } from "framer-motion";
import { ChessPiece } from "./types";
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
      className="w-full max-w-[min(90vh,600px)] mx-auto"
    >
      <div className={cn(
        "relative grid grid-cols-8 gap-[2px] p-6 rounded-xl overflow-hidden",
        "bg-[#8E9196] shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgogIDxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjIiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] before:opacity-30",
        "after:absolute after:inset-0 after:rounded-xl after:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.2)]"
      )}>
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
            const isLight = (rowIndex + colIndex) % 2 === 0;
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                disabled={isThinking || (gameOver && !isWhiteTurn)}
                className={cn(
                  "aspect-square flex items-center justify-center text-4xl sm:text-5xl relative",
                  "transition-all duration-300 ease-out",
                  "border border-black/5",
                  isLight ? 'bg-[#eee]/90' : 'bg-[#403E43]/90',
                  isSelected && 'ring-2 ring-yellow-400/50 shadow-lg scale-[1.02] z-10',
                  isPossibleMove && 'after:absolute after:inset-3 after:rounded-full after:bg-yellow-400/20 after:animate-pulse',
                  'hover:bg-opacity-80',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <motion.span
                  initial={false}
                  animate={{ 
                    scale: piece ? 1 : 0.8,
                    opacity: piece ? 1 : 0 
                  }}
                  className={cn(
                    "relative z-10 drop-shadow-lg transition-transform",
                    piece?.isWhite 
                      ? "text-white filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" 
                      : "text-[#222] filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.1)]"
                  )}
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

