
import { useState, useCallback } from "react";
import { ChessPiece } from "@/types/chess";
import { calculatePossibleMoves } from "./chessUtils";
import { toast } from "sonner";

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
    const piece = board[fromRow][fromCol];
    if (!piece) {
      toast.error("Aucune pièce sélectionnée");
      return board;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[toRow][toCol] = piece;
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
    handlePieceSelect,
    makeMove,
    resetBoard,
    setBoard,
    setPossibleMoves,
    setSelectedPiece
  };
}

function initializeBoard(): (ChessPiece | null)[][] {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', isWhite: false };
    board[6][i] = { type: 'pawn', isWhite: true };
  }

  // Initialize other pieces
  const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'] as const;
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: backRow[i], isWhite: false };
    board[7][i] = { type: backRow[i], isWhite: true };
  }

  return board;
}
