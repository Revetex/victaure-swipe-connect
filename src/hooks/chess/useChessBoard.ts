
import { useState, useCallback } from "react";
import { ChessPiece } from "@/types/chess";
import { initializeBoard, calculatePossibleMoves } from "./chessUtils";

export function useChessBoard() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<{row: number, col: number}[]>([]);

  const handlePieceSelect = useCallback((row: number, col: number, isWhiteTurn: boolean) => {
    const piece = board[row][col];
    if (piece && piece.isWhite === isWhiteTurn) {
      setSelectedPiece({ row, col });
      const moves = calculatePossibleMoves(row, col, piece, board);
      setPossibleMoves(moves);
      return true;
    }
    return false;
  }, [board]);

  const makeMove = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[toRow][toCol] = board[fromRow][fromCol];
    newBoard[fromRow][fromCol] = null;
    setBoard(newBoard);
    setSelectedPiece(null);
    setPossibleMoves([]);
    return newBoard;
  }, [board]);

  const resetBoard = useCallback(() => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setPossibleMoves([]);
  }, []);

  return {
    board,
    selectedPiece,
    possibleMoves,
    setBoard,
    handlePieceSelect,
    makeMove,
    resetBoard,
    setPossibleMoves,
    setSelectedPiece,
  };
}
