import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sword, RotateCcw, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChessPiece {
  type: string;
  isWhite: boolean;
}

export function ChessPage() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

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

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    const piece = board[row][col];

    if (selectedPiece) {
      // Move logic
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        const newBoard = [...board];
        newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory([...moveHistory, move]);
        
        setBoard(newBoard);
        setSelectedPiece(null);
        setIsWhiteTurn(!isWhiteTurn);

        // AI's turn
        if (!gameOver && isWhiteTurn) {
          setIsThinking(true);
          try {
            const { data, error } = await supabase.functions.invoke('chess-ai-move', {
              body: { board: newBoard }
            });

            if (error) throw error;

            if (data.move) {
              const { from, to } = data.move;
              const aiMove = `${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
              setMoveHistory([...moveHistory, move, aiMove]);
              
              const aiBoard = [...newBoard];
              aiBoard[to.row][to.col] = aiBoard[from.row][from.col];
              aiBoard[from.row][from.col] = null;
              setBoard(aiBoard);
            }

            if (data.gameOver) {
              setGameOver(true);
              toast.success("Checkmate! Game Over");
            }
          } catch (error) {
            console.error('AI move error:', error);
            toast.error("Error making AI move");
          } finally {
            setIsThinking(false);
            setIsWhiteTurn(true);
          }
        }
      } else {
        toast.error("Invalid move");
        setSelectedPiece(null);
      }
    } else if (piece && piece.isWhite === isWhiteTurn) {
      setSelectedPiece({ row, col });
    }
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    if (targetPiece && targetPiece.isWhite === piece.isWhite) {
      return false;
    }

    // Basic movement rules
    switch (piece.type) {
      case 'pawn':
        if (piece.isWhite) {
          return fromCol === toCol && (fromRow - toRow === 1 || (fromRow === 6 && fromRow - toRow === 2));
        } else {
          return fromCol === toCol && (toRow - fromRow === 1 || (fromRow === 1 && toRow - fromRow === 2));
        }
      case 'rook':
        return fromRow === toRow || fromCol === toCol;
      case 'knight':
        return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
               (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
      case 'bishop':
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
      case 'queen':
        return fromRow === toRow || fromCol === toCol ||
               Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
      case 'king':
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
      default:
        return false;
    }
  };

  const getSquareName = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[col]}${8 - row}`;
  };

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

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    toast.success("New game started");
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sword className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Chess vs AI</h1>
          </div>
          <Button variant="outline" size="icon" onClick={resetGame}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="aspect-square mb-4">
          <div className="grid grid-cols-8 gap-0 border border-border">
            {board.map((row, rowIndex) => (
              row.map((piece, colIndex) => {
                const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                const isLight = (rowIndex + colIndex) % 2 === 0;
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    disabled={isThinking || (gameOver && !isWhiteTurn)}
                    className={`
                      aspect-square flex items-center justify-center text-3xl
                      ${isLight ? 'bg-light-purple/20' : 'bg-dark-purple/20'}
                      ${isSelected ? 'ring-2 ring-primary' : ''}
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className={`h-5 w-5 ${isWhiteTurn ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium">
              {isThinking ? "AI is thinking..." : isWhiteTurn ? "Your turn" : "AI's turn"}
            </span>
          </div>
          {gameOver && (
            <Button variant="outline" onClick={resetGame}>
              Play Again
            </Button>
          )}
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg max-h-32 overflow-y-auto">
          <h3 className="font-medium mb-2">Move History:</h3>
          {moveHistory.map((move, index) => (
            <div key={index} className="text-sm text-muted-foreground">
              {index + 1}. {move}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}