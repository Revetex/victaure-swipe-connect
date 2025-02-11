
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
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className="aspect-square w-full bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-xl shadow-2xl border border-slate-700"
      >
        <div className="grid grid-cols-8 gap-0 h-full w-full bg-slate-800 rounded-lg overflow-hidden">
          {board.map((row, rowIndex) => (
            row.map((piece, colIndex) => {
              const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
              const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
              const isLight = (rowIndex + colIndex) % 2 === 0;
              
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  disabled={(!isWhiteTurn && !piece?.isWhite) || isThinking || gameOver}
                  aria-label={`Square ${String.fromCharCode(97 + colIndex)}${8 - rowIndex}${piece ? ` with ${piece.type}` : ''}`}
                  className={cn(
                    "w-full h-full flex items-center justify-center relative",
                    "transition-all duration-200",
                    isMobile ? "text-3xl sm:text-4xl" : "text-5xl sm:text-6xl",
                    isLight ? 'bg-slate-200' : 'bg-slate-400',
                    isSelected && 'ring-2 ring-yellow-400 ring-inset z-10',
                    isPossibleMove && 'after:absolute after:inset-2 after:rounded-full after:bg-yellow-400/30 after:animate-pulse',
                    'hover:bg-opacity-90 active:bg-opacity-80',
                    'disabled:cursor-not-allowed disabled:opacity-100'
                  )}
                >
                  {piece && (
                    <span 
                      className={cn(
                        "transform transition-transform",
                        piece.isWhite ? "text-white drop-shadow-lg" : "text-slate-900",
                        isSelected && "scale-110"
                      )}
                    >
                      {getPieceSymbol(piece)}
                    </span>
                  )}
                </button>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
}
