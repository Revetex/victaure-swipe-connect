
import { ChessPiece } from "@/types/chess";

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function canMoveToPosition(
  row: number, 
  col: number, 
  piece: ChessPiece, 
  board: (ChessPiece | null)[][]
): boolean {
  if (!isValidPosition(row, col)) return false;
  const targetPiece = board[row][col];
  return !targetPiece || targetPiece.isWhite !== piece.isWhite;
}
