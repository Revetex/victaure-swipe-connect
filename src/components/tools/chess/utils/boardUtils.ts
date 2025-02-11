
import { ChessPiece } from "@/types/chess";

export function initializeBoard(): (ChessPiece | null)[][] {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', isWhite: false };
    board[6][i] = { type: 'pawn', isWhite: true };
  }

  // Initialize other pieces
  const backRowPieces: ('rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'bishop' | 'knight' | 'rook')[] = 
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: backRowPieces[i], isWhite: false };
    board[7][i] = { type: backRowPieces[i], isWhite: true };
  }

  return board;
}

export function getSquareName(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  return files[col] + ranks[row];
}
