
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
  // Une pièce ne peut pas capturer une pièce de sa propre couleur
  if (targetPiece && targetPiece.isWhite === piece.isWhite) return false;
  return true;
}

export function isPathClear(
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: (ChessPiece | null)[][]
): boolean {
  const rowDir = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colDir = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
  
  let currentRow = fromRow + rowDir;
  let currentCol = fromCol + colDir;
  
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol] !== null) {
      return false;
    }
    currentRow += rowDir;
    currentCol += colDir;
  }
  
  return true;
}
