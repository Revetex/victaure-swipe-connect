
import { ChessPiece } from "@/types/chess";

export function initializeBoard(): (ChessPiece | null)[][] {
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

export function getSquareName(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return `${files[col]}${8 - row}`;
}

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

