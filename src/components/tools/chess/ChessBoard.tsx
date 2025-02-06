import { motion } from "framer-motion";
import { ChessPiece } from "./types";

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
    <div className="aspect-square mb-4">
      <div className="grid grid-cols-8 gap-0 border border-border">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
            const isLight = (rowIndex + colIndex) % 2 === 0;
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                disabled={isThinking || (gameOver && !isWhiteTurn)}
                className={`
                  aspect-square flex items-center justify-center text-3xl relative
                  ${isLight ? 'bg-light-purple/20' : 'bg-dark-purple/20'}
                  ${isSelected ? 'ring-2 ring-primary' : ''}
                  ${isPossibleMove ? 'after:absolute after:inset-2 after:rounded-full after:bg-primary/20' : ''}
                  hover:bg-primary/20 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {getPieceSymbol(piece)}
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
}