
import { useState, useCallback } from "react";
import { ChessPiece } from "@/types/chess";
import { toast } from "sonner";
import { initializeBoard, getSquareName } from "./utils/boardUtils";
import { calculatePossibleMoves } from "./utils/moveCalculator";
import { handleAIMove } from "./utils/aiHandler";

export function useChessGame() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [possibleMoves, setPossibleMoves] = useState<{row: number, col: number}[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");

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
          await handleAIMove(
            newBoard,
            difficulty,
            setBoard,
            setMoveHistory,
            setGameOver,
            setIsThinking,
            setIsWhiteTurn
          );
        }
      } else {
        toast.error("Coup invalide");
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (piece && piece.isWhite === isWhiteTurn) {
      setSelectedPiece({ row, col });
      const moves = calculatePossibleMoves(row, col, piece, board);
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
    toast.success("Nouvelle partie commencée");
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
