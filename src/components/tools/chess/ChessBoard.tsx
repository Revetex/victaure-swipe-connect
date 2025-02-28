
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
  lastMoveHighlight: {from: {row: number, col: number}, to: {row: number, col: number}} | null;
  onSquareClick: (row: number, col: number) => void;
}

export function ChessBoard({
  board,
  selectedPiece,
  possibleMoves,
  isThinking,
  gameOver,
  isWhiteTurn,
  lastMoveHighlight,
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

  // Fonction pour obtenir le nom de la case d'échecs (a1, b2, etc.)
  const getSquareName = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[col] + ranks[row];
  };

  return (
    <div className="relative w-full max-w-md mx-auto sm:max-w-2xl">
      <div className="aspect-square w-full">
        <div className="grid grid-cols-8 h-full w-full rounded-lg overflow-hidden border border-[#64B5D9]/30 shadow-2xl bg-gradient-to-br from-[#1A1F2C]/90 to-[#1A2A4A]/90">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
              const isPossibleMove = possibleMoves.some(
                move => move.row === rowIndex && move.col === colIndex
              );
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const squareName = getSquareName(rowIndex, colIndex);
              
              // Check if this square is part of the last move
              const isLastMoveFrom = lastMoveHighlight && 
                                    lastMoveHighlight.from.row === rowIndex && 
                                    lastMoveHighlight.from.col === colIndex;
              const isLastMoveTo = lastMoveHighlight && 
                                  lastMoveHighlight.to.row === rowIndex && 
                                  lastMoveHighlight.to.col === colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "relative w-full aspect-square",
                    "flex items-center justify-center",
                    isLight 
                      ? "bg-[#D8E2DC]/5" 
                      : "bg-[#64B5D9]/10",
                    isSelected && "ring-2 ring-yellow-400 ring-inset z-10",
                    (isLastMoveFrom || isLastMoveTo) && "bg-emerald-400/20",
                    !gameOver && !isThinking && "cursor-pointer hover:brightness-125 active:brightness-95 transition-all duration-150",
                    gameOver && "cursor-not-allowed opacity-75"
                  )}
                  onClick={() => !gameOver && !isThinking && onSquareClick(rowIndex, colIndex)}
                >
                  {/* Indicateur de case */}
                  {(rowIndex === 7 || colIndex === 0) && (
                    <div className="absolute text-[8px] md:text-[10px] text-[#64B5D9]/60 font-bold z-10">
                      {rowIndex === 7 && colIndex === 0 ? (
                        <span className="absolute bottom-0.5 left-0.5">{squareName}</span>
                      ) : rowIndex === 7 ? (
                        <span className="absolute bottom-0.5 left-0.5">{squareName[0]}</span>
                      ) : (
                        <span className="absolute bottom-0.5 left-0.5">{squareName[1]}</span>
                      )}
                    </div>
                  )}
                  
                  {isPossibleMove && (
                    <motion.div
                      className={cn(
                        "absolute inset-2 md:inset-3 rounded-full",
                        piece ? "bg-yellow-500/40 border-2 border-yellow-400" : "bg-yellow-400/20 border-2 border-yellow-400/50"
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    />
                  )}
                  
                  {piece && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none transition-transform",
                        piece.isWhite ? "text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" : "text-black drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]",
                        "hover:scale-110",
                        isThinking && piece.isWhite !== isWhiteTurn && "animate-pulse"
                      )}
                    >
                      {pieceToSymbol(piece)}
                    </motion.span>
                  )}

                  {/* Overlay effect when AI is thinking */}
                  {isThinking && !isWhiteTurn && (
                    <div className="absolute inset-0 bg-purple-500/5 pointer-events-none" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Status indicator */}
      {isThinking && !gameOver && (
        <div className="absolute -bottom-10 left-0 right-0 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg 
                className="h-4 w-4 text-violet-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
                <path d="M17.5 8a4.5 4.5 0 0 0 -4.5 4.5"></path>
                <path d="M19 11v-3h-3"></path>
              </svg>
            </motion.div>
            <span className="text-sm text-violet-300">L'IA réfléchit...</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
