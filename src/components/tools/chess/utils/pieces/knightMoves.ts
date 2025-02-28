
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

const KNIGHT_MOVES = [
  [-2, -1], [-2, 1],
  [-1, -2], [-1, 2],
  [1, -2], [1, 2],
  [2, -1], [2, 1]
] as const;

export function calculateKnightMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];

  for (const [rowOffset, colOffset] of KNIGHT_MOVES) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    
    if (canMoveToPosition(newRow, newCol, piece, board)) {
      moves.push({ row: newRow, col: newCol });
    }
  }

  return moves;
}
