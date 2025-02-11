
import { motion } from "framer-motion";
import { ChessPiece } from "@/types/chess";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="w-full max-w-[min(90vh,800px)] mx-auto aspect-square"
    >
      <div className="grid grid-cols-8 h-full w-full gap-0 bg-yellow-500/20 p-1.5 rounded-xl overflow-hidden shadow-xl border border-white/10">
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
                disabled={(!isWhiteTurn && !piece?.isWhite) || isThinking || gameOver}
                aria-label={`Square ${String.fromCharCode(97 + colIndex)}${8 - rowIndex}${piece ? ` with ${piece.type}` : ''}`}
                className={cn(
                  "aspect-square flex items-center justify-center relative",
                  "transition-all duration-300 ease-out",
                  isMobile ? "text-4xl sm:text-5xl" : "text-6xl sm:text-7xl",
                  isLight ? 'bg-[#E8EDF9] hover:bg-[#DAE3F3]' : 'bg-[#B7C0D8] hover:bg-[#A1AECF]',
                  isSelected && 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20 z-10 scale-105',
                  isPossibleMove && 'after:absolute after:inset-3 after:rounded-full after:bg-yellow-400/30 after:animate-pulse',
                  'disabled:cursor-not-allowed disabled:opacity-100'
                )}
              >
                {piece && (
                  <motion.span 
                    initial={false}
                    animate={{ 
                      scale: isSelected ? 1.1 : 1,
                      y: isSelected ? -2 : 0
                    }}
                    className={cn(
                      "drop-shadow-lg transition-transform",
                      piece.isWhite ? "text-white" : "text-[#2A2A2A]",
                      "hover:drop-shadow-2xl"
                    )}
                  >
                    {getPieceSymbol(piece)}
                  </motion.span>
                )}
              </motion.button>
            );
          })
        ))}
      </div>
    </motion.div>
  );
}
