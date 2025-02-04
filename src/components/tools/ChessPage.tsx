import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ChessPage() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  function initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Initialize pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', isWhite: false };
      board[6][i] = { type: 'pawn', isWhite: true };
    }

    // Initialize other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRow[i], isWhite: false };
      board[7][i] = { type: backRow[i], isWhite: true };
    }

    return board;
  }

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];

    if (selectedPiece) {
      // Move logic here
      const newBoard = [...board];
      newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      setBoard(newBoard);
      setSelectedPiece(null);
      setIsWhiteTurn(!isWhiteTurn);
    } else if (piece && piece.isWhite === isWhiteTurn) {
      setSelectedPiece({ row, col });
    }
  };

  const getPieceSymbol = (piece: any) => {
    if (!piece) return null;
    
    const symbols: any = {
      pawn: { true: '♙', false: '♟' },
      rook: { true: '♖', false: '♜' },
      knight: { true: '♘', false: '♞' },
      bishop: { true: '♗', false: '♝' },
      queen: { true: '♕', false: '♛' },
      king: { true: '♔', false: '♚' }
    };

    return symbols[piece.type][piece.isWhite];
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6">Échecs vs IA</h1>
        
        <div className="aspect-square">
          <div className="grid grid-cols-8 gap-0 border border-border">
            {board.map((row, rowIndex) => (
              row.map((piece, colIndex) => {
                const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                const isLight = (rowIndex + colIndex) % 2 === 0;
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    className={`
                      aspect-square flex items-center justify-center text-3xl
                      ${isLight ? 'bg-light-purple/20' : 'bg-dark-purple/20'}
                      ${isSelected ? 'ring-2 ring-primary' : ''}
                      hover:bg-primary/20 transition-colors
                    `}
                  >
                    {getPieceSymbol(piece)}
                  </button>
                );
              })
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-medium">
            Tour : {isWhiteTurn ? 'Blancs' : 'Noirs'}
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => {
              setBoard(initializeBoard());
              setSelectedPiece(null);
              setIsWhiteTurn(true);
            }}
          >
            Nouvelle partie
          </Button>
        </div>
      </motion.div>
    </div>
  );
}