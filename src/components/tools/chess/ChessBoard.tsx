
import { motion, AnimatePresence } from "framer-motion";
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

  const boardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    }
  };

  const squareVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={boardVariants}
      className="w-full max-w-[min(500px,90vw)] mx-auto mb-6"
    >
      <motion.div 
        className={cn(
          "grid grid-cols-8 gap-0.5 border border-border rounded-xl overflow-hidden",
          "shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "touch-none" // Prevent unwanted touch events
        )}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {board.map((row, rowIndex) => (
            row.map((piece, colIndex) => {
              const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
              const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
              const isLight = (rowIndex + colIndex) % 2 === 0;
              
              return (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  variants={squareVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  disabled={isThinking || (gameOver && !isWhiteTurn)}
                  className={cn(
                    "aspect-square flex items-center justify-center text-2xl sm:text-3xl relative",
                    "transition-all duration-300",
                    "active:scale-95 touch-manipulation",
                    isLight ? 'bg-light-purple/20' : 'bg-dark-purple/20',
                    isSelected ? 'ring-2 ring-primary shadow-lg scale-105' : '',
                    isPossibleMove ? 'after:absolute after:inset-2 after:rounded-full after:bg-primary/20 after:animate-pulse' : '',
                    'hover:bg-primary/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <motion.span
                    initial={false}
                    animate={{ 
                      scale: piece ? 1 : 0.8,
                      opacity: piece ? 1 : 0,
                      rotateY: piece ? 0 : 180
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="relative z-10"
                  >
                    {getPieceSymbol(piece)}
                  </motion.span>
                </motion.button>
              );
            })
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
