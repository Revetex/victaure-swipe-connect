
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

  const getCoordLabel = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[col]}${8 - row}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[min(90vh,600px)] mx-auto"
    >
      <div className="relative">
        {/* Coordonnées des colonnes (haut) */}
        <div className="absolute -top-6 left-0 right-0 flex justify-around px-4">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
            <span key={file} className="text-xs text-muted-foreground">
              {file}
            </span>
          ))}
        </div>

        {/* Coordonnées des rangées (gauche) */}
        <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around py-2">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(rank => (
            <span key={rank} className="text-xs text-muted-foreground">
              {rank}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-8 gap-px bg-neutral-300 p-1 rounded-lg overflow-hidden">
          {board.map((row, rowIndex) => (
            row.map((piece, colIndex) => {
              const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
              const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const coordLabel = getCoordLabel(rowIndex, colIndex);
              
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  disabled={(!isWhiteTurn && !piece?.isWhite) || isThinking || gameOver}
                  aria-label={`Case ${coordLabel}${piece ? ` avec ${piece.type}` : ''}`}
                  className={cn(
                    "aspect-square flex items-center justify-center relative",
                    "transition-all duration-200 ease-out",
                    isMobile ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
                    isLight ? 'bg-[#E8EDF9] hover:bg-[#D8E0F0]' : 'bg-[#B7C0D8] hover:bg-[#A7B0C8]',
                    isSelected && 'ring-2 ring-yellow-400 z-10',
                    isPossibleMove && 'after:absolute after:inset-3 after:rounded-full after:bg-yellow-400/20',
                    'disabled:cursor-not-allowed disabled:opacity-100',
                    piece && 'hover:scale-105 active:scale-100'
                  )}
                >
                  {piece && (
                    <span className={cn(
                      "drop-shadow-md transition-transform",
                      piece.isWhite ? "text-white" : "text-[#2A2A2A]",
                      isSelected && "scale-110",
                      "hover:drop-shadow-lg"
                    )}>
                      {getPieceSymbol(piece)}
                    </span>
                  )}
                </button>
              );
            })
          ))}
        </div>
      </div>
    </motion.div>
  );
}
