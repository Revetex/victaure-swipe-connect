import { useState, useCallback } from "react";
import { ChessPiece } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useChessGame() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [possibleMoves, setPossibleMoves] = useState<{row: number, col: number}[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");

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
      board[0][i] = { type: backRow[i] as ChessPiece['type'], isWhite: false };
      board[7][i] = { type: backRow[i] as ChessPiece['type'], isWhite: true };
    }

    return board;
  }

  const getSquareName = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[col]}${8 - row}`;
  };

  const calculatePossibleMoves = useCallback((fromRow: number, fromCol: number, piece: ChessPiece) => {
    const moves: {row: number, col: number}[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(fromRow, fromCol, row, col)) {
          moves.push({ row, col });
        }
      }
    }
    
    return moves;
  }, [board]);

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    if (targetPiece && targetPiece.isWhite === piece.isWhite) {
      return false;
    }

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

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    const piece = board[row][col];

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = [...board];
        newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory([...moveHistory, move]);
        
        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setIsWhiteTurn(!isWhiteTurn);

        // AI's turn
        if (!gameOver && isWhiteTurn) {
          setIsThinking(true);
          try {
            const { data, error } = await supabase.functions.invoke('chess-ai-move', {
              body: { 
                board: newBoard,
                difficulty: difficulty
              }
            });

            if (error) throw error;

            if (data.move) {
              const { from, to } = data.move;
              const aiMove = `${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
              setMoveHistory(prev => [...prev, aiMove]);
              
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
        setPossibleMoves([]);
      }
    } else if (piece && piece.isWhite === isWhiteTurn) {
      setSelectedPiece({ row, col });
      const moves = calculatePossibleMoves(row, col, piece);
      setPossibleMoves(moves);
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setPossibleMoves([]);
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    toast.success("New game started");
  };

  return {
    board,
    selectedPiece,
    isWhiteTurn,
    isThinking,
    gameOver,
    moveHistory,
    possibleMoves,
    difficulty,
    handleSquareClick,
    resetGame,
    setDifficulty,
  };
}