
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

export function calculatePawnMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];
  const direction = piece.isWhite ? -1 : 1;

  // Forward move
  if (canMoveToPosition(row + direction, col, piece, board) && !board[row + direction][col]) {
    moves.push({ row: row + direction, col });
    // First move can be 2 squares
    if (
      ((piece.isWhite && row === 6) || (!piece.isWhite && row === 1)) &&
      !board[row + direction][col] &&
      !board[row + 2 * direction][col]
    ) {
      moves.push({ row: row + 2 * direction, col });
    }
  }

  // Capture diagonally
  for (const colOffset of [-1, 1]) {
    if (canMoveToPosition(row + direction, col + colOffset, piece, board) && 
        board[row + direction][col + colOffset]?.isWhite !== piece.isWhite) {
      moves.push({ row: row + direction, col: col + colOffset });
    }
  }

  return moves;
}
